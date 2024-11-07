import React, { useState } from "react";
import UploadPDF from "./components/UploadPDF";
import AskQuestion from "./components/AskQuestion";
import "./App.css";

const App = () => {
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [conversationCleared, setConversationCleared] = useState(false);

  // Clear all conversation-related states and uploaded file
  const clearConversation = () => {
    setConversationCleared(true);
    setUploadedFileName(""); // Clear the uploaded file name
  };

  // Reset the uploaded file name and related state when the conversation is cleared
  const resetUploadedFileName = () => {
    setUploadedFileName(""); // Reset the file name when clearing conversation
  };

  // Reset file selection and upload status in UploadPDF component
  const resetFileState = () => {
    setUploadedFileName(""); // Reset file name in App state
  };

  return (
    <div className="app-container">
      <UploadPDF
        setUploadedFileName={setUploadedFileName}
        resetFileState={resetFileState} // Pass resetFileState function
      />
      <AskQuestion
        uploadedFileName={uploadedFileName}
        clearConversation={clearConversation}
        resetUploadedFileName={resetUploadedFileName} // Pass resetUploadedFileName function
      />
    </div>
  );
};

export default App;
