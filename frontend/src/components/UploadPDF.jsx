import React, { useState } from 'react';
import axios from 'axios';
import AskQuestion from './AskQuestion';

const UploadPDF = () => {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post("http://13.233.68.186:8000/upload-pdf", formData);
            setResponse(res.data);
        } catch (error) {
            console.error("Error uploading PDF:", error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload PDF</button>
            {response && <div>Uploaded: {response.file_name}</div>}
            <AskQuestion response={response}/>
        </div>
    );
};

export default UploadPDF;
