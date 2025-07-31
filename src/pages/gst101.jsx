// src/pages/GST101QuizPage.jsx

// Part 1: Bring in the Tools (Our React building blocks)
import React, { useState, useEffect, useCallback } from 'react';
// ✨ CHANGE: Import axios here! ✨
import axios from 'axios'; // Our reliable messenger for talking to Django

// Part 2: Create our React Page Component
const GST101Page = () => { // Renamed from GST101Page for consistency with our previous lessons
  // Part 3: The Quiz Manager's Sticky Notes (State Variables)
  const [questions, setQuestions] = useState([]);          // All questions from backend
  const [currentIndex, setCurrentIndex] = useState(0);     // Which question we're on
  const [selectedAnswers, setSelectedAnswers] = useState({}); // User's answers, stored by question ID (from Claude)
  const [selectedOptionForDisplay, setSelectedOptionForDisplay] = useState(null); // Which option is *currently* selected for visual feedback on the screen
  const [timeLeft, setTimeLeft] = useState(60);            // 60 seconds per question (our change)
  const [quizEnded, setQuizEnded] = useState(false);       // Whether the whole quiz is finished (from our original code, simplified)
  const [score, setScore] = useState(0);                   // Final calculated score (from Claude)
  const [submissionResult, setSubmissionResult] = useState(''); // Result of score submission (from Claude)

  // --- Functions (Our Quiz Workers / Assistants) ---

  // This function calculates the final score and sends it to Django.
  const finishQuizAndSubmit = useCallback(async () => {
    if (quizEnded) return;

    let correctAnswersCount = 0;
    questions.forEach(question => {
      const userAnswer = selectedAnswers[question.id];
      if (userAnswer === question.correct_answer) {
        correctAnswersCount++;
      }
    });

    setScore(correctAnswersCount);
    setQuizEnded(true);

    // ✨ CHANGE: Using axios.post instead of fetch for submission ✨
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.warn("No authentication token found. Cannot submit score. Please log in.");
        setSubmissionResult("You need to be logged in to save your score!");
        return;
      }

      console.log("DEBUG FRONTEND: Score value IMMEDIATELY before sending to backend:", correctAnswersCount);

      // axios.post takes URL, data, and then config (like headers)
      const response = await axios.post(
        'http://localhost:8000/api/quiz/submit-quiz-result/',
        {
          course_code: 'GST101',
          score: correctAnswersCount
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`
          }
        }
      );

      // With axios, response.data is already the parsed JSON
      console.log("Score submission successful:", response.data);
      setSubmissionResult(`Score submitted! Highest score: ${response.data.highest_score}`);
    } catch (err) {
      // axios errors often have a 'response' object with 'data' for server errors
      console.error('Error submitting score:', err.response ? err.response.data : err.message);
      if (err.response && err.response.status === 401) {
        setSubmissionResult("You are not authorized. Please log in to save your score!");
      } else {
        setSubmissionResult('Error submitting score to server. Please try again.');
      }
    }
  }, [questions, selectedAnswers, quizEnded]);


  // Go to the next question
  const handleNext = useCallback(() => {
    if (currentIndex >= questions.length - 1) {
      finishQuizAndSubmit();
    } else {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  }, [currentIndex, questions.length, finishQuizAndSubmit]);

  // Function to handle when user selects an answer
  const handleOptionSelect = useCallback((optionKey) => {
    if (selectedOptionForDisplay === null) {
      setSelectedOptionForDisplay(optionKey);

      setSelectedAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questions[currentIndex].id]: optionKey
      }));

      setTimeout(() => {
        handleNext();
      }, 1000); // Wait 1 second
    }
  }, [selectedOptionForDisplay, currentIndex, questions, handleNext]);

  // --- Robots (useEffect Hooks) that run automatically ---

  // Robot 1: Get questions when component loads
  // ✨ CHANGE: Using axios.get instead of fetch for fetching questions ✨
  useEffect(() => {
    console.log("Robot 1: Starting to fetch questions...");
    axios.get('http://localhost:8000/api/quiz/questions/GST101/')
      .then((response) => {
        console.log("Robot 1: Questions fetched successfully!", response.data);
        setQuestions(response.data);
      })
      .catch((error) => {
        // axios errors have a 'response' object for server errors
        console.error("Robot 1: Failed to load questions:", error.response ? error.response.data : error.message);
      });
  }, []); // Run only once when the component first appears


  // Robot 2: Timer and Auto-Advance Logic
  useEffect(() => {
    if (questions.length === 0 || quizEnded) {
      return;
    }

    setTimeLeft(60);
    setSelectedOptionForDisplay(null);

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          if (selectedOptionForDisplay === null) {
            handleNext();
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, questions.length, quizEnded, selectedOptionForDisplay, handleNext]);


  // Robot 3: Trigger the final submission when quiz ends
  useEffect(() => {
    if ((currentIndex >= questions.length && questions.length > 0) || (timeLeft === 0 && currentIndex === questions.length - 1 && !quizEnded)) {
      console.log("Robot 3: Quiz ending condition met, preparing to submit...");
      const delaySubmit = setTimeout(() => {
        finishQuizAndSubmit();
      }, 200); // Wait 200 milliseconds
      return () => clearTimeout(delaySubmit);
    }
  }, [currentIndex, questions.length, timeLeft, quizEnded, finishQuizAndSubmit]);


  // Helper to format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // --- What You See on the Screen (The Display Part / JSX) ---

  // Show loading screen if questions are not loaded yet
  if (questions.length === 0) {
    return (
      <div className="content">
        <h1>Loading GST101 Questions...</h1>
        <p>Please make sure your Django backend server is running and accessible!</p>
        <p>If not, check your browser console (F12) for errors.</p>
      </div>
    );
  }

  // Show results after quiz is finished
  if (quizEnded) {
    const finalPercentage = Math.round((score / questions.length) * 100);
    return (
      <div style={{ padding: '20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Quiz Completed!</h1>
        <div style={{
          backgroundColor: '#f0f0f0',
          padding: '20px',
          borderRadius: '10px',
          margin: '20px 0'
        }}>
          <h2>Your Results</h2>
          <p style={{ fontSize: '24px', margin: '10px 0' }}>
            Score: {score}/{questions.length}
          </p>
          <p style={{ fontSize: '18px', margin: '10px 0' }}>
            Percentage: {finalPercentage}%
          </p>
          {submissionResult && (
            <p style={{
              color: submissionResult.includes('successfully') || submissionResult.includes('Score submitted!') ? 'green' : 'red',
              margin: '10px 0'
            }}>
              {submissionResult}
            </p>
          )}
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '15px 30px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Take Quiz Again
        </button>
      </div>
    );
  }

  // Main quiz interface (while quiz is ongoing)
  const currentQuestion = questions[currentIndex];

  return (
    <div className="content">
      {/* Header with timer and progress */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h1>GST101 Quiz</h1>
        <div>
          <span style={{
            backgroundColor: timeLeft < 10 ? '#ff6b6b' : '#28a745', // Timer turns red at 10 seconds
            color: 'white',
            padding: '8px 15px',
            borderRadius: '20px',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            Time: {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '20px' }}>
        <p>Question {currentIndex + 1} of {questions.length}</p>
        <div style={{
          width: '100%',
          backgroundColor: '#e0e0e0',
          borderRadius: '10px',
          height: '10px'
        }}>
          <div style={{
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
            backgroundColor: '#007bff',
            height: '100%',
            borderRadius: '10px'
          }}></div>
        </div>
      </div>

      {/* Current Question */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '25px',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginBottom: '20px', lineHeight: '1.5' }}>
          {currentQuestion.question_text}
        </h3>

        {/* Answer Options */}
        <div>
          {Object.entries(currentQuestion.options).map(([key, value]) => {
            let bgColor = ''; // Start with no background color

            // If an option has been selected for display (user clicked one)
            if (selectedOptionForDisplay) {
              if (key === currentQuestion.correct_answer) {
                bgColor = 'lightgreen'; // Correct answer is always green
              } else if (key === selectedOptionForDisplay) {
                bgColor = 'salmon'; // User's selected answer (if wrong) is red
              }
            }

            return (
              <div key={key} style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  cursor: selectedOptionForDisplay ? 'default' : 'pointer', // No pointer if already answered
                  backgroundColor: bgColor, // Apply the background color
                  borderColor: selectedOptionForDisplay && key === currentQuestion.correct_answer ? 'green' :
                               selectedOptionForDisplay && key === selectedOptionForDisplay ? 'red' : '#e0e0e0'
                }}>
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={key}
                    checked={selectedAnswers[currentQuestion.id] === key} // Show current saved answer
                    onChange={() => handleOptionSelect(key)} // Use our new handleOptionSelect
                    disabled={selectedOptionForDisplay !== null} // Disable input if already answered this question
                    style={{ marginRight: '15px' }}
                  />
                  <span style={{ fontSize: '16px' }}>
                    <strong>{key}.</strong> {value}
                  </span>
                </label>
              </div>
            );
          })}
        </div>

        {/* Text Feedback: "Correct!" or "Wrong Answer" */}
        {selectedOptionForDisplay && ( // Only show this text if an option has been selected for display.
          <p style={{
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              marginTop: '15px',
              // Use ternary for color: green for correct, red for wrong.
              color: selectedOptionForDisplay === currentQuestion.correct_answer ? 'green' : 'red'
          }}>
              
          </p>
        )}
      </div>

      {/* Quick submit option - Our new "Finish Quiz Early" button */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={finishQuizAndSubmit} // Call the function to calculate score and submit
          style={{
            padding: '10px 20px',
            backgroundColor: '#ffc107', // Yellowish color
            color: '#212529',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Finish Quiz Early
        </button>
      </div>
    </div>
  );
};

export default GST101Page;