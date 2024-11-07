import React, { useState } from "react";
import axios from "axios";

const AskQuestion = ({
  uploadedFileName,
  clearConversation,
  resetUploadedFileName,
}) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
    setError("");
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/ask-question", {
        question,
        file_name: uploadedFileName,
      });

      setAnswer(response.data.answer.response || "No answer found.");
      setError("");
    } catch (error) {
      setAnswer("");
      setError(
        error.response?.data?.detail || "An error occurred. Please try again."
      );
    }
  };

  const handleClear = () => {
    setQuestion("");
    setAnswer("");
    setError("");
    clearConversation();
    resetUploadedFileName();
  };

  return (
    <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-8 border border-gray-300 space-y-4 w-full max-w-md mx-auto mt-6">
      {uploadedFileName && (
        <p className="text-gray-600">Uploaded File: {uploadedFileName}</p>
      )}

      <input
        type="text"
        value={question}
        onChange={handleQuestionChange}
        placeholder="Enter your question here"
        className={`border-2 p-2 rounded w-full max-w-md ${
          error ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
      />
      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={handleAskQuestion}
        className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition transform hover:scale-105"
      >
        Ask Question
      </button>

      {answer && (
        <p className="mt-4 text-gray-700 font-medium">Answer: {answer}</p>
      )}

      {(question || answer) && (
        <button
          onClick={handleClear}
          className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition transform hover:scale-105"
        >
          Clear Conversation
        </button>
      )}
    </div>
  );
};

export default AskQuestion;
