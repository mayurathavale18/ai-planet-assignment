import React, { useState, useEffect } from "react";
import axios from "axios";

const UploadPDF = ({ setUploadedFileName, resetFileState }) => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    resetFileState();
  }, [resetFileState]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setUploadStatus("");
    } else {
      setUploadStatus("Please select a valid PDF file.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("No file selected. Please choose a PDF file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://127.0.0.1:8000/upload-pdf",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUploadedFileName(response.data.file_name);
      setUploadStatus("File uploaded successfully!");
    } catch (error) {
      setUploadStatus(
        error.response?.data?.detail ||
          "An error occurred during upload. Please try again."
      );
    }
  };

  const handleClear = () => {
    setFile(null);
    setUploadStatus("");
  };

  return (
    <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-8 border border-gray-300 space-y-4 w-full max-w-md mx-auto mt-8">
      <label
        htmlFor="pdf-upload"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition transform hover:scale-105"
      >
        {isHovering ? "Click to select a PDF file" : "Choose PDF File"}
      </label>
      <input
        id="pdf-upload"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />
      {file && <p className="text-gray-700">Selected File: {file.name}</p>}

      <button
        onClick={handleUpload}
        className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition transform hover:scale-105"
      >
        Upload PDF
      </button>

      <button
        onClick={handleClear}
        className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition transform hover:scale-105"
      >
        Clear Upload
      </button>

      {uploadStatus && (
        <p
          className={`mt-2 ${
            uploadStatus.includes("successfully")
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {uploadStatus}
        </p>
      )}
    </div>
  );
};

export default UploadPDF;
