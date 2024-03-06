FROM python:3.11-slim

WORKDIR /app

COPY . /app

COPY .env .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 9639

CMD ["python", "main.py"]