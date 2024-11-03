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

    // axios
    //   .post(
    //     "http://127.0.0.1:8000/ask_question",
    //     { file_name: fileName, question: question }
    //   )
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((err) => {
    //     setError(err.message)
    //     console.log(err)
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });

    //     axios.post("http://127.0.0.1:8000/ask_question", {
    //         file_name: "Mayur_Athavale__FullStack__.pdf",
    //         question: "hello"
    //     })
    //     .then(response => {
    //         console.log("Answer received:", response.data);
    //     })
    //     .catch(error => {
    //         console.error("Error asking question:", error);
    //     })
    //     .finally(() => {
    //         console.log("Request completed");
    //     });
    //   };

    try {
      const response = await axios.post("http://127.0.0.1:8000/ask-question", {
        file_name: fileName,
        question: question,
      });
      console.log(response.data.answer)
      setAnswer(response.data.answer.response);
    } catch (error) {
      console.error("Error asking question:", error);
    } finally {
      setLoading(false); // Log to ensure request chain ends properly
      console.log("Request completed");
    }
  };

  return (
    <div>
      <h2>Ask a Question about the PDF</h2>
      <form onSubmit={handleQuestionSubmit}>
        <div>
          <label>File Name:</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter uploaded PDF file name"
            required
          />
        </div>
        <div>
          <label>Question:</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Asking..." : "Ask Question"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {answer && (
        <div>
          <h3>Answer:</h3>
          <p>response : {[...answer]}</p>
        </div>
      )}
    </div>
  );
};

export default AskQuestion;
