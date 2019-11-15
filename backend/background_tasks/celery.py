from celery import Celery
import os
import yaml

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_PATH = os.path.join(BASE_DIR, 'background_tasks', 'config.yml')

CONFIG = yaml.load(open(CONFIG_PATH), Loader=yaml.FullLoader)

app = Celery(
    __name__,
    include=[
        'app.background_tasks.tasks',
    ],
)

app.conf.beat_schedule = {
    'process_round': {
        'task': 'celery_tasks.tasks.process_round',
        'schedule': CONFIG['game']['round_time'],
    },
}

app.conf.update(CONFIG['celery'])