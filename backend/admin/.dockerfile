FROM python:3.11-slim

WORKDIR /app

COPY . /app

COPY .env .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8931

ENV FLASK_APP=main.py

CMD ["flask", "run", "--host=0.0.0.0", "--port=8931", "--reload"]