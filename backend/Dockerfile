FROM python:3.10.0

RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    python3 --version && \
    pip3 --version

WORKDIR /app
COPY . .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN pip uninstall llama-index
RUN pip install --upgrade llama-index
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]