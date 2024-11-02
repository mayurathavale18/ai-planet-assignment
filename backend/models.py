# backend/models.py

from sqlalchemy import Column, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class PDFMetadata(Base):
    __tablename__ = "pdf_metadata"
    id = Column(String, primary_key=True, index=True)
    file_name = Column(String)
    upload_date = Column(DateTime, default=datetime.utcnow)
