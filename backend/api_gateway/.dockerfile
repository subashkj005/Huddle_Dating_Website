FROM python:3.9-slim

ENV REDIS_HOST=localhost
ENV REDIS_PORT=6379

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5001

# Run the Flask application
CMD ["python", "main.py"]
