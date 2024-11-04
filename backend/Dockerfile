FROM your-base-image

RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    python3 --version && \
    pip3 --version

WORKDIR /app
COPY . .
RUN python3 -m pip install --upgrade pip
RUN python3 -m pip install -r requirements.txt
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]