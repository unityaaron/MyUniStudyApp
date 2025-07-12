import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Helps us talk to backend

const GST101Page = () => {
  // 🧠 These track what’s happening during the quiz
  const [questions, setQuestions] = useState([]); // Starts empty
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);

  // 📦 This runs when the page first opens
  useEffect(() => {
    axios.get("http://localhost:8000/api/questions/GST101/")
      .then((res) => {
        setQuestions(res.data); // 🧠 Save the questions
      })
      .catch((err) => {
        console.error("Failed to load questions:", err);
      });
  }, []);

  // 🕐 While we wait for data from backend
  if (questions.length === 0) {
    return <p>Loading questions...</p>;
  }

  // 🔄 Get the current question from the list
  const currentQuestion = questions[currentIndex];

  // ✅ Check if selected answer is the right one
  const isCorrect = selectedOption === currentQuestion.correct_answer;

  // ➡️ Move to next question
  const handleNext = () => {
    if (isCorrect) {
      setScore(score + 1);
    }

    setSelectedOption(null); // reset selected option
    setCurrentIndex(currentIndex + 1);
  };

  // 🎉 If all questions are finished
  if (currentIndex >= questions.length) {
    const finalScore = Math.round((score / questions.length) * 100);

    return (
      <div className="content">
        <h2>🎉 Quiz Finished!</h2>
        <p>Your score is: <strong>{finalScore}%</strong></p>
        <p>You got <strong>{score}</strong> out of <strong>{questions.length}</strong> right.</p>
      </div>
    );
  }

  // 🖼️ What the user sees while answering
  return (
    <div className="content">
      <h2>Question {currentIndex + 1} of {questions.length}</h2>
      <p><strong>Q:</strong> {currentQuestion.question_text}</p>

      {/* Loop through all options (A-D) */}
      {Object.entries(currentQuestion.options).map(([key, value]) => {
        let bgColor = '';
        if (selectedOption) {
          if (key === currentQuestion.correct_answer) {
            bgColor = 'lightgreen';
          } else if (key === selectedOption) {
            bgColor = 'salmon';
          }
        }

        return (
          <div
            key={key}
            onClick={() => !selectedOption && setSelectedOption(key)}
            style={{
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              margin: '10px 0',
              cursor: selectedOption ? 'default' : 'pointer',
              backgroundColor: bgColor,
            }}
          >
            <strong>{key}:</strong> {value}
          </div>
        );
      })}

      {/* Show result + next button only if option was picked */}
      {selectedOption && (
        <>
          <p>{isCorrect ? "✅ Correct!" : "❌ Wrong Answer"}</p>
          <button onClick={handleNext}>Next</button>
        </>
      )}
    </div>
  );
};

export default GST101Page;
