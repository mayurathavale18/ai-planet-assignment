# PDF Question-Answering Application

## Overview

The PDF Question-Answering Application is a full-stack solution that allows users to upload PDF documents and ask context-specific questions. Utilizing FastAPI for the backend, LangChain or LlamaIndex for question-answering capabilities, and a React.js frontend with Vite, this application provides a smooth user experience for interacting with documents in natural language. PDFs are stored in AWS S3 for reliable access and scalability.

## Table of Contents

1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Installation and Setup](#installation-and-setup)
6. [Usage Guide](#usage-guide)
7. [Error Handling](#error-handling)
8. [Future Enhancements](#future-enhancements)
9. [License](#license)

## Features

- **PDF Upload**: Securely upload PDF documents to AWS S3 for storage.
- **Natural Language Question-Answering**: Leverage advanced language models to answer questions based on the uploaded PDF content.
- **Responsive UI**: Clean and user-friendly interface built with React and Vite.
- **Robust Error Handling**: Provides clear feedback for upload and query processes.

## Technology Stack

### Backend
- **FastAPI**: RESTful API framework for handling file uploads and question-answering requests.
- **LangChain or LlamaIndex**: Frameworks for efficient question-answering from documents.
- **AWS S3**: Secure storage for uploaded PDF files.

### Frontend
- **React.js**: UI framework for building an interactive user interface.
- **Vite**: Development server and build tool for a faster, optimized frontend.

### Database
- **SQLite / PostgreSQL**: Optional storage for user and document metadata.

### Deployment
- **Docker**: Containerization of the backend for easy deployment.
- **AWS EC2**: Hosting for the backend server.
  
## Project Structure

```
├── backend
│   ├── main.py              # FastAPI app entry point
|   ├── requirements.txt     # Backend dependencies
│   └── Dockerfile           # Dockerfile for backend containerization
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   │   ├── UploadPDF.jsx       # PDF upload component
│   │   │   └── AskQuestion.jsx     # Question-answering component
│   │   └── App.js                 # Main React app file
│   └── package.json
│
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Python 3.9 or higher**
- **Node.js and npm**
- **Docker** (for backend deployment)
- **AWS CLI** (configured with appropriate permissions for S3)

## Installation and Setup

### Backend

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/pdf-question-answering-app.git
    cd pdf-question-answering-app/backend
    ```

2. **Set up a virtual environment and install dependencies**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

3. **Configure AWS Credentials**:
   Ensure your AWS credentials are set up to access S3. This can be done by running:
    ```bash
    aws configure
    ```

4. **Run the backend**:
    ```bash
    uvicorn app:app --host 0.0.0.0 --port 8000
    ```

### Frontend

1. **Navigate to the frontend directory**:
    ```bash
    cd ../frontend
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Run the frontend**:
    ```bash
    npm run dev
    ```

The application should now be accessible at `http://localhost:3000` for the frontend and `http://localhost:8000` for the backend.

### Docker Deployment (Optional)

1. **Build the Docker image for the backend**:
    ```bash
    docker build -t pdf-qa-backend .
    ```

2. **Run the Docker container**:
    ```bash
    docker run -d -p 8000:8000 pdf-qa-backend
    ```

## Usage Guide

### 1. Uploading a PDF
   - Click on **Choose PDF File** and select a PDF from your device.
   - Click **Upload PDF** to send the file to the server. 
   - The system will store the file in AWS S3 and return a confirmation message.

### 2. Asking a Question
   - After a successful upload, enter the uploaded file’s name in the **File Name** input field.
   - Type a question in the **Question** input field and click **Ask Question**.
   - The system will process the question using the document context and return an answer.

### 3. Clearing Conversation
   - Click **Clear Conversation** to reset the input fields and clear the current session.

## Error Handling

The application includes comprehensive error handling to ensure smooth operation. Here are some examples:

- **File Upload Errors**: If an unsupported file type is selected or if the upload fails, the system will display a descriptive error message.
- **Question-Answering Errors**: In case of a failed response from the server, an error message is shown to guide the user.
- **AWS S3 Errors**: Connectivity or permission issues with S3 will result in user feedback for troubleshooting.

All error handling is logged for backend analysis and includes response codes for easy debugging.

## Future Enhancements

Some potential improvements for the application include:

- **Enhanced Security**: Implementing user authentication for secure access control.
- **Multi-format Support**: Allowing uploads of other document types such as DOCX.
- **Improved Query Performance**: Using caching strategies to speed up repeat queries.
- **Detailed Analytics**: Tracking frequently asked questions and user engagement statistics.

## License

This project is licensed under the MIT License. You are free to use, modify, and distribute this software, provided the original author is credited.
