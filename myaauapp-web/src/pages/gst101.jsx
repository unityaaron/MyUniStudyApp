// src/pages/GST101QuizPage.jsx

// Part 1: Bring in the Tools (Our React building blocks)
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Part 2: Create our React Page Component
const GST101Page = () => {
  // Part 3: The Quiz Manager's Sticky Notes (State Variables)
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedOptionForDisplay, setSelectedOptionForDisplay] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [quizEnded, setQuizEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [submissionResult, setSubmissionResult] = useState('');

  // --- Functions (Our Quiz Workers / Assistants) ---

  // This function calculates the final score and sends it to Django.
  const finishQuizAndSubmit = useCallback(async () => {
    if (quizEnded) return;
    setQuizEnded(true);

    // The fix: Make sure we have the most up-to-date answers right now.
    let correctAnswersCount = 0;
    questions.forEach(question => {
      const userAnswer = selectedAnswers[question.id];
      if (userAnswer === question.correct_answer) {
        correctAnswersCount++;
      }
    });

    setScore(correctAnswersCount);

    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.warn("No authentication token found. Cannot submit score. Please log in.");
        setSubmissionResult("You need to be logged in to save your score!");
        return;
      }
      console.log("DEBUG FRONTEND: Score value IMMEDIATELY before sending to backend:", correctAnswersCount);

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

      console.log("Score submission successful:", response.data);
      setSubmissionResult(`Score submitted! Highest score: ${response.data.highest_score}`);
    } catch (err) {
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
    setCurrentIndex((prevIndex) => prevIndex + 1);
  }, []);

  // Function to handle when user selects an answer
  const handleOptionSelect = useCallback((optionKey) => {
    if (selectedOptionForDisplay === null) {
      setSelectedOptionForDisplay(optionKey);

      // Save the selected answer
      setSelectedAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questions[currentIndex].id]: optionKey
      }));
    }
  }, [selectedOptionForDisplay, currentIndex, questions]);


  // --- Robots (useEffect Hooks) that run automatically ---

  // Robot 1: Get questions when component loads
  useEffect(() => {
    console.log("Robot 1: Starting to fetch questions...");
    axios.get('http://localhost:8000/api/quiz/questions/GST101/')
      .then((response) => {
        console.log("Robot 1: Questions fetched successfully!", response.data);
        setQuestions(response.data);
      })
      .catch((error) => {
        console.error("Robot 1: Failed to load questions:", error.response ? error.response.data : error.message);
      });
  }, []);


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


  // ✨ FIX: New Robot to handle Quiz Flow and Final Submission
  // Robot 3: This robot watches for a change in the user's selected answers
  useEffect(() => {
    if (Object.keys(selectedAnswers).length === questions.length && questions.length > 0) {
      console.log("FIXED BUG ROBOT: All answers are in! Ending quiz...");
      // We wait a moment just to make sure the user has time to see the last answer feedback
      const delaySubmit = setTimeout(() => {
        finishQuizAndSubmit();
      }, 1500); // Wait 1.5 seconds after the last answer is selected
      return () => clearTimeout(delaySubmit);
    } else if (Object.keys(selectedAnswers).length > currentIndex) {
      // This part now handles moving to the next question after an answer is selected
      const delayNext = setTimeout(() => {
        handleNext();
      }, 1500); // Wait 1.5 seconds before moving to the next question
      return () => clearTimeout(delayNext);
    }
  }, [selectedAnswers, questions.length, currentIndex, finishQuizAndSubmit, handleNext]);


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
        <h1>Loading Questions...</h1>
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
          backgroundColor: 'var(--bg-color)',
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

  const currentQuestion = questions[currentIndex];

  return (
    <div className="content">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h1><span style={{color: 'black'}}>GST101 Quiz</span></h1>
        <div>
          <span style={{
            backgroundColor: timeLeft < 10 ? '#ff6b6b' : '#28a745',
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

      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '25px',
        marginBottom: '20px',
        color: 'black'
      }}>
        <h3 style={{ marginBottom: '20px', lineHeight: '1.5' }}>
          {currentQuestion.question_text}
        </h3>

        <div>
          {Object.entries(currentQuestion.options).map(([key, value]) => {
            let bgColor = '';

            if (selectedOptionForDisplay) {
              if (key === currentQuestion.correct_answer) {
                bgColor = 'lightgreen';
              } else if (key === selectedOptionForDisplay) {
                bgColor = 'salmon';
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
                  cursor: selectedOptionForDisplay ? 'default' : 'pointer',
                  backgroundColor: bgColor,
                  borderColor: selectedOptionForDisplay && key === currentQuestion.correct_answer ? 'green' :
                               selectedOptionForDisplay && key === selectedOptionForDisplay ? 'red' : '#e0e0e0'
                }}>
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={key}
                    checked={selectedAnswers[currentQuestion.id] === key}
                    onChange={() => handleOptionSelect(key)}
                    disabled={selectedOptionForDisplay !== null}
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

        {selectedOptionForDisplay && (
          <p style={{
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              marginTop: '15px',
              color: selectedOptionForDisplay === currentQuestion.correct_answer ? 'green' : 'red'
          }}>
              {selectedOptionForDisplay === currentQuestion.correct_answer ? 'Correct!' : 'Wrong Answer'}
          </p>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={finishQuizAndSubmit}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ffc107',
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

