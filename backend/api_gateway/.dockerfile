FROM python:3.11-slim

ENV REDIS_HOST=huddle-redis-service
ENV REDIS_PORT=6379

WORKDIR /app

COPY . /app

COPY .env .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5001

# Run the Flask application
CMD ["python", "main.py"]
