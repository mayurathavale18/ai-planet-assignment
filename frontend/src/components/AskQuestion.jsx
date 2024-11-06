import React, { useState } from "react";
import axios from "axios";

const AskQuestion = () => {
  const [fileName, setFileName] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://13.233.68.186:8000/ask-question",
        {
          file_name: fileName,
          question: question,
        }
      );
      setAnswer(response.data.answer.response);
    } catch (error) {
      console.error("Error asking question:", error);
      setError("Failed to retrieve answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-700">
        Ask a Question about the PDF
      </h2>
      <form onSubmit={handleQuestionSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600">
            File Name:
          </label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter uploaded PDF file name"
            className="p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600">Question:</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here"
            className="p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`py-2 px-4 rounded-lg transition duration-200 ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          {loading ? "Asking..." : "Ask Question"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {answer && (
        <div className="mt-4 p-2 bg-white rounded-lg shadow">
          <h3 className="text-md font-semibold text-gray-700">Answer:</h3>
          <p className="text-gray-800">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default AskQuestion;
