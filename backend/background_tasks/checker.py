import subprocess
import os
import db
import cfg
import secrets

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def task_status(status):
    d = {'UP': 101, 'CORRUPT': 102, 'MUMBLE': 103, 'DOWN': 104, 'CHECKER_ERROR': 110}
    k = {101: 'UP', 102: 'CORRUPT', 103:'MUMBLE', 104:'DOWN', 110:'CHECKER_ERROR'}
    return d[status] if status in d.keys() else k[status] if status in k.keys() else 110

def get_env():
    env_path = os.path.join(BASE_DIR, cfg.game_cfg()['checkers_path'], 'checker_venv/')
    env = os.environ.copy()
    env['PATH'] = f"{env_path}:{env['PATH']}"
    return env

def run_command_gracefully(*popenargs,
                           input=None,
                           capture_output=False,
                           timeout=None,
                           check=False,
                           terminate_timeout=3,
                           **kwargs):
    if input is not None:
        kwargs['stdin'] = subprocess.PIPE

    if capture_output:
        kwargs['stdout'] = subprocess.PIPE
        kwargs['stderr'] = subprocess.PIPE

    killed = False
    with subprocess.Popen(*popenargs, **kwargs) as proc:
        try:
            stdout, stderr = proc.communicate(input, timeout=timeout)
        except subprocess.TimeoutExpired:
            proc.terminate()
            try:
                stdout, stderr = proc.communicate(input, timeout=terminate_timeout)
            except subprocess.TimeoutExpired:
                proc.kill()
                killed = True
                stdout, stderr = proc.communicate()
            except:
                proc.kill()
                raise

            raise subprocess.TimeoutExpired(
                proc.args,
                timeout=timeout,
                output=stdout,
                stderr=stderr,
            )
        except:
            proc.kill()
            raise

        retcode = proc.poll()

        if check and retcode:
            raise subprocess.CalledProcessError(
                retcode,
                proc.args,
                output=stdout,
                stderr=stderr
            )

    return subprocess.CompletedProcess(proc.args, retcode, stdout, stderr), killed

def run_command(command, timeout, round):
    env = get_env()
    try:
        result, killed = run_command_gracefully(command,capture_output=True,timeout=timeout,env=env)
        try:
            status = task_status(result.returncode)
            message = result.stdout[:1024].decode().strip()
            error = result.stderr[:1024].decode().strip()

        except ValueError:
            status = task_status('CHECKER_ERROR')
            message = 'Check failed'
            error = 'Check failed'

    except subprocess.TimeoutExpired:
        status = task_status('DOWN')
        private_message = 'timeout'
        public_message = 'timeout'

    result = db.models.Check(message=public_message,error=private_message,command=str(command),status=status, round=round)
    return result

def run_check(checker_path, host, round, timeout):
    check_command = [
        checker_path,
        'check',
        host,
    ]

    return run_command(command=check_command,timeout=timeout,round=round)


def run_put(checker_path, host, flag, vuln, timeout, round):
    flag_id = secrets.token_hex(20)

    put_command = [
        checker_path,
        'put',
        host,
        flag_id,
        flag.flag,
        str(vuln),
    ]

    return run_command(command=put_command,timeout=timeout, round=round), flag_id


def run_get(checker_path, host, flag, timeout, round):
    get_command = [
        checker_path,
        'get',
        host,
        flag.flag_id,
        flag.flag,
        str(flag.vuln),
    ]

    return run_command(command=get_command,timeout=timeout,round=round)
