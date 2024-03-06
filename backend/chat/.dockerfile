FROM python:3.11-slim

WORKDIR /app

COPY . /app

COPY .env .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5236

ENV FLASK_APP=main.py

CMD ["flask", "run", "--host=0.0.0.0", "--port=5236", "--reload"]
