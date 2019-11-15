FROM python:3.7-alpine

RUN apk update && apk add postgresql-dev gcc python3-dev musl-dev

ARG FLOWER_BASIC_AUTH
ADD backend/requirements.txt /requirements.txt
RUN pip install -r requirements.txt
RUN pip install psycopg2

ADD backend /app
ADD config.yml /app/background_tasks/config.yml

CMD celery flower -A app.background_tasks --basic_auth="${FLOWER_BASIC_AUTH}" --url-prefix=flower --host=0.0.0.0 --port=5555