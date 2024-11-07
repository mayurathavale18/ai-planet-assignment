from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import PyPDF2
import boto3
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from functools import lru_cache
import io
from typing import List

from llama_index.core import VectorStoreIndex
from llama_index.core import Settings
from llama_index.llms.huggingface_api import HuggingFaceInferenceAPI
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core.schema import Document

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

HF_TOKEN = os.getenv("HUGGING_FACE_TOKEN")

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define SQLAlchemy models
class PDFMetadata(Base):
    __tablename__ = "pdf_metadata"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    file_name = Column(String)
    upload_date = Column(DateTime, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# AWS S3 Configuration
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")
BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

# Endpoint to upload PDF
@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Invalid file type.")

    # Upload PDF to S3
    try:
        s3_client.upload_fileobj(file.file, BUCKET_NAME, file.filename)
    except Exception as e:
        print(f"S3 upload error: {e}")
        raise HTTPException(status_code=500, detail="Error uploading file to S3.")

    # Save metadata to database
    db = SessionLocal()
    pdf_metadata = PDFMetadata(file_name=file.filename)
    db.add(pdf_metadata)
    db.commit()
    db.refresh(pdf_metadata)

    return {"file_name": pdf_metadata.file_name, "upload_date": pdf_metadata.upload_date}

class AskQuestionRequest(BaseModel):
    question: str

# Dependency to retrieve the list of file names from the database
def get_file_names() -> List[str]:
    db = SessionLocal()
    file_names = db.query(PDFMetadata.file_name).all()
    return [f[0] for f in file_names]

# LRU cache for responses
@lru_cache(maxsize=50)
def get_answer_in_memory(file_name: str, question: str):
    # Retrieve PDF from S3
    try:
        s3_response = s3_client.get_object(Bucket=BUCKET_NAME, Key=file_name)
        pdf_content = s3_response['Body'].read()
    except Exception as e:
        print(f"S3 retrieval error: {e}")
        raise HTTPException(status_code=404, detail="PDF not found in S3.")

    # Extract text from PDF in memory
    pdf_text = ""
    pdf_stream = PyPDF2.PdfReader(io.BytesIO(pdf_content))
    for page in pdf_stream.pages:
        pdf_text += page.extract_text() or ""

    # Load the PDF text as a document (context)
    document = Document(text=pdf_text)

    # Set up the Hugging Face embedding and language model
    Settings.llm = HuggingFaceInferenceAPI(model_name="HuggingFaceH4/zephyr-7b-alpha", token=HF_TOKEN)
    Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")

    # Create the index directly in memory without saving any output to S3
    index = VectorStoreIndex.from_documents([document])
    query_engine = index.as_query_engine()

    # Perform the query
    answer = query_engine.query(question)

    return answer

# Endpoint to ask questions
@app.post("/ask-question")
async def ask_question(
    request_data: AskQuestionRequest, 
    file_names: list = Depends(get_file_names)
):
    if not file_names:
        raise HTTPException(status_code=404, detail="No files found in the database.")
    
    # Answer the question based on the latest uploaded PDF
    answer = get_answer_in_memory(file_names[-1], request_data.question)
    if not answer:
        return {"answer": "No answer found."}
    
    return {"answer": answer}
