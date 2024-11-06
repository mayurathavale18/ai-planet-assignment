import React, { useState } from 'react';
import UploadPDF from './components/UploadPDF';
import AskQuestion from './components/AskQuestion';

const App = () => {
    const [uploadedFileName, setUploadedFileName] = useState("");

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-6">PDF Question-Answer App</h1>
            
            {/* PDF Upload Section */}
            <UploadPDF setUploadedFileName={setUploadedFileName} />
            
            {/* Conditional Rendering of Ask Question Section */}
            {uploadedFileName && (
                <div className="mt-8 w-full max-w-md">
                    <h2 className="text-lg font-semibold text-center mb-4">Ask a Question</h2>
                    <AskQuestion uploadedFileName={uploadedFileName} />
                </div>
            )}
        </div>
    );
};

export default App;
