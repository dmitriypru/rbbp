FROM python:3.7-alpine

RUN apk update && apk add postgresql-dev gcc python3-dev musl-dev

ADD backend/requirements.txt /requirements.txt
RUN pip install -r requirements.txt
RUN pip install psycopg2

ADD backend /app
ADD config.yml /app/background_tasks/config.yml

CMD ["celery", "beat", "-A", "app.background_tasks"]