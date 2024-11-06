  // import React, { useState } from "react";
  // import axios from "axios";

  // const AskQuestion = () => {
  //   const [fileName, setFileName] = useState("");
  //   const [question, setQuestion] = useState("");
  //   const [answer, setAnswer] = useState("");
  //   const [loading, setLoading] = useState(false);
  //   const [error, setError] = useState("");

  //   const handleQuestionSubmit = async (e) => {
  //     e.preventDefault();
  //     setLoading(true);
  //     setError("");

  //     try {
  //       const response = await axios.post(
  //         "http://127.0.0.1:8000/ask-question",
  //         {
  //           question: question,
  //         }
  //       );
  //       setAnswer(response.data.answer.response);
  //     } catch (error) {
  //       console.error("Error asking question:", error);
  //       setError("Failed to retrieve answer.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   return (
  //     <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
  //       <h2 className="text-lg font-semibold text-gray-700">
  //         Ask a Question about the PDF
  //       </h2>
  //       <form onSubmit={handleQuestionSubmit} className="flex flex-col space-y-4">
  //         <div className="flex flex-col">
  //           <label className="text-sm font-medium text-gray-600">Question:</label>
  //           <textarea
  //             value={question}
  //             onChange={(e) => setQuestion(e.target.value)}
  //             placeholder="Type your question here"
  //             className="p-2 border border-gray-300 rounded-md"
  //             required
  //           />
  //         </div>
  //         <button
  //           type="submit"
  //           disabled={loading}
  //           className={`py-2 px-4 rounded-lg transition duration-200 ${
  //             loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
  //           } text-white`}
  //         >
  //           {loading ? "Asking..." : "Ask Question"}
  //         </button>
  //       </form>
  //       {error && <p className="text-red-500 mt-2">{error}</p>}
  //       {answer && (
  //         <div className="mt-4 p-2 bg-white rounded-lg shadow">
  //           <h3 className="text-md font-semibold text-gray-700">Answer:</h3>
  //           <p className="text-gray-800">{answer}</p>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  // export default AskQuestion;

  import React, { useState } from 'react';
  import axios from 'axios';
  
  const AskQuestion = ({ uploadedFileName }) => {
      const [question, setQuestion] = useState("");
      const [answer, setAnswer] = useState("");
      const [isHovering, setIsHovering] = useState(false);
      const [error, setError] = useState("");
  
      const handleQuestionChange = (e) => {
          setQuestion(e.target.value);
          setError(""); // Reset error when question is modified
      };
  
      const handleAskQuestion = async () => {
          if (!question.trim()) {
              setError("Please enter a question.");
              return;
          }
  
          try {
              const response = await axios.post("http://127.0.0.1:8000/ask-question", {
                  question,
                  file_name: uploadedFileName
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
  
      return (
          <div className="p-4 flex flex-col items-center">
              <input
                  type="text"
                  value={question}
                  onChange={handleQuestionChange}
                  placeholder="Enter your question here"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className={`border-2 p-2 rounded w-full max-w-md ${error ? "border-red-500" : "border-gray-300"} focus:outline-none`}
              />
              {isHovering && !error && (
                  <small className="text-gray-500">Ask a question related to the uploaded PDF</small>
              )}
              {error && <p className="text-red-500 mt-1">{error}</p>}
  
              <button
                  onClick={handleAskQuestion}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
              >
                  Ask Question
              </button>
  
              {answer && <p className="mt-4 text-gray-700">Answer: {answer}</p>}
          </div>
      );
  };
  
  export default AskQuestion;
  