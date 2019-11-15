from celery import shared_task, chain
from celery.signals import worker_ready
from celery.utils.log import get_task_logger
import requests
import db
import cfg

@worker_ready.connect
def startup(**_kwargs):
    db.models.db.create_tables([db.models.Check, db.models.Flag, db.models.Game, db.models.Submit, db.models.Task, db.models.Team])
    if db.models.Game.select().count() == 0:
        db.models.Game.create(running=False, score=0, round=0)

        teams = cfg.team_cfg()
        for team in teams:
            db.models.Team.create(name=team['name'], type=team['type'], ip=team['ip'])
        
        tasks = cfg.task_cfg()
        for task in tasks:
            db.models.Task.create(name=task['name'], checker=task['checker'], gets=task['gets'], puts=task['puts'], status=104)
        
    start_game.apply_async(eta=cfg.game_cfg()['start_time'])

@shared_task
def start_game():
    game = db.models.Game.select().first()

    if game:
        game.running = True
        game.save()

@shared_task
def process_round():
    game = db.models.Game.select().first()
    
    if not game.running:
        return 
    
    tasks = db.models.Task.select()
    
    game.round += 1
    game.save()