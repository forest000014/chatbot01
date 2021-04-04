# Dockerfile GPU
FROM pytorch/pytorch:1.6.0-cuda10.1-cudnn7-runtime

RUN apt-get update && \
    apt-get install -y && \
    apt-get install -y apt-utils wget

RUN pip install --upgrade pip
RUN pip install transformers \
    flask \
    Flask-Cors \
    waitress \
    torch

WORKDIR /app
COPY . .

EXPOSE 8080

CMD ["python", "demo/start_demo.py"]
