from peewee import PostgresqlDatabase
import backend.cfg as cfg
import backend.db.models as models

db = PostgresqlDatabase(cfg.db_cfg()['postgres'])