from pydantic import BaseModel
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine, Column, String, DateTime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import PyPDF2
import boto3
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware


# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)


# Database setup
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define SQLAlchemy models
class PDFMetadata(Base):
    __tablename__ = "pdf_metadata"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)  # Auto-incrementing integer
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

UPLOAD_DIRECTORY = "./uploads"

# Ensure the uploads directory exists
if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

# Endpoint to upload PDF
@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Invalid file type.")
    
    # Define the file path
    file_path = os.path.join(UPLOAD_DIRECTORY, file.filename)

    # Save the uploaded PDF file
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    # Upload PDF to S3
    try:
        s3_client.upload_fileobj(file.file, os.getenv("AWS_BUCKET_NAME"), file.filename)
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

# Endpoint to ask questions
# @app.post("/ask_question")
# async def ask_question(file_name: str, question: str):
#     # Load PDF content
#     file_path = f"./uploads/{file_name}"
    
#     if not os.path.exists(file_path):
#         raise HTTPException(status_code=404, detail="PDF not found")
    
#     # Extract text from PDF (you may use a more sophisticated method here)
#     with open(file_path, "rb") as f:
#         reader = PyPDF2.PdfReader(f)
#         text = ""
#         for page in reader.pages:
#             text += page.extract_text() or ""

#     # Here, you would implement your NLP processing using LangChain or LlamaIndex
#     answer = process_question_with_nlp(text, question)  # Replace with actual NLP processing
#     print(answer)

#     return {"answer": answer, "file_name": file_name, "question": question}

class AskQuestionRequest(BaseModel):
    file_name: str
    question: str

# @app.post("/ask_question")
# async def ask_question(request_data: AskQuestionRequest):
#     file_name = request_data.file_name
#     question = request_data.question
#     # Your processing logic here
#     return {"answer": "This is a dummy answer"}

# def process_question_with_nlp(pdf_text, question):
#     # Placeholder for actual NLP logic
#     return f"This is a placeholder answer for the question: '{question}'"

@app.post("/ask_question")
async def ask_question(request_data: AskQuestionRequest):
    file_name = request_data.file_name
    question = request_data.question
    
    # Load PDF content
    file_path = f"./uploads/{file_name}"
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="PDF not found")
    
    # Extract text from PDF
    with open(file_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""

    # NLP processing placeholder (integrate with LangChain or LlamaIndex)
    answer = process_question_with_nlp(text, question)

    return {"answer": answer}

# NLP processing function (mock)
def process_question_with_nlp(text, question):
    # Placeholder for NLP integration
    return "This is a mock answer based on NLP processing."

# Run the app
# Use this command: uvicorn main:app --reload
