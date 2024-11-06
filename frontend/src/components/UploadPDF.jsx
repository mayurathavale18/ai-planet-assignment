import React, { useState } from "react";
import axios from "axios";
import AskQuestion from "./AskQuestion";

const UploadPDF = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://13.233.68.186:8000/upload-pdf",
        formData
      );
      setResponse(res.data);
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-md">
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-2 p-2 border border-gray-300 rounded-md w-full"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
      >
        Upload PDF
      </button>
      {response && (
        <div className="mt-4 text-green-500">
          Uploaded: {response.file_name}
        </div>
      )}
      <AskQuestion response={response} />
    </div>
  );
};

export default UploadPDF;
