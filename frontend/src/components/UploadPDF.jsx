// import React, { useState } from "react";
// import axios from "axios";
// import AskQuestion from "./AskQuestion";

// const UploadPDF = () => {
//   const [file, setFile] = useState(null);
//   const [response, setResponse] = useState(null);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await axios.post(
//         "http://127.0.0.1:8000/upload-pdf",
//         formData
//       );
//       setResponse(res.data);
//     } catch (error) {
//       console.error("Error uploading PDF:", error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-md">
//       <input
//         type="file"
//         onChange={handleFileChange}
//         className="mb-2 p-2 border border-gray-300 rounded-md w-full"
//       />
//       <button
//         onClick={handleUpload}
//         className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
//       >
//         Upload PDF
//       </button>
//       {response && (
//         <div className="mt-4 text-green-500">
//           Uploaded: {response.file_name}
//         </div>
//       )}
//       <AskQuestion response={response} />
//     </div>
//   );
// };

// export default UploadPDF;

import React, { useState } from 'react';
import axios from 'axios';

const UploadPDF = ({ setUploadedFileName }) => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [isHovering, setIsHovering] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
            setUploadStatus(""); // Reset status
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

            const response = await axios.post("http://127.0.0.1:8000/upload-pdf", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setUploadedFileName(response.data.file_name);
            setUploadStatus("File uploaded successfully!");
        } catch (error) {
            setUploadStatus(
                error.response?.data?.detail || "An error occurred during upload. Please try again."
            );
        }
    };

    return (
        <div className="p-4 flex flex-col items-center">
            <label
                htmlFor="pdf-upload"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
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

            <button
                onClick={handleUpload}
                className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
            >
                Upload PDF
            </button>

            {uploadStatus && (
                <p className={`mt-2 ${uploadStatus.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
                    {uploadStatus}
                </p>
            )}
        </div>
    );
};

export default UploadPDF;
