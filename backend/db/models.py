from peewee import Model, CharField, ForeignKeyField, IntegerField, BooleanField, IPField, DateTimeField
from . import db
import datetime

class BaseModel(Model):
    class Meta:
        database = db

class Game(BaseModel):
    running = BooleanField(default=False)
    score = IntegerField(default=0)
    round = IntegerField(default=0)

class Team(BaseModel):
    name = CharField(max_length=255)
    type = CharField(max_length=4)
    ip = IPField(null=True)

class Task(BaseModel):
    name = CharField(max_length=255)
    checker = CharField(max_length=255)
    env = CharField(max_length=255)
    gets = IntegerField(default=1)
    puts = IntegerField(default=1)
    status = IntegerField(default=104)

class Flag(BaseModel):
    flag = CharField(max_length=255)
    task = ForeignKeyField(Task, on_delete='CASCADE')
    round = IntegerField()

class Check(BaseModel):
    status = IntegerField()
    command = CharField(max_length=5)
    message = CharField(max_length=255)
    round = IntegerField()

class Submit(BaseModel):
    flag = ForeignKeyField(Flag, on_delete='CASCADE')
    time = DateTimeField(default=datetime.datetime.now)