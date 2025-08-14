// screens/QuizScreen.jsx

// Part 1: Bring in the Tools (React Native Building Blocks)
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/api';


// Part 2: Create our React Page Component
const QuizScreen = () => {
  const route = useRoute();
  const { courseId } = route.params;

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

  const finishQuizAndSubmit = useCallback(async () => {
    if (quizEnded) return;
    setQuizEnded(true);

    let correctAnswersCount = 0;
    questions.forEach(question => {
      const userAnswer = selectedAnswers[question.id];
      if (userAnswer === question.correct_answer) {
        correctAnswersCount++;
      }
    });

    setScore(correctAnswersCount);

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        Alert.alert("Error", "You need to be logged in to save your score!");
        setSubmissionResult("You need to be logged in to save your score!");
        return;
      }
      console.log("DEBUG FRONTEND: Score value before sending to backend:", correctAnswersCount);

      const response = await fetch(
        `${API_URL}/api/quiz/submit-quiz-result/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`
          },
          body: JSON.stringify({
            course_code: courseId,
            score: correctAnswersCount
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit score');
      }

      const responseData = await response.json();
      console.log("Score submission successful:", responseData);
      setSubmissionResult(`Score submitted! Highest score: ${responseData.highest_score}`);
    } catch (err) {
      console.error('Error submitting score:', err.message);
      setSubmissionResult('Error submitting score to server. Please try again.');
    }
  }, [questions, selectedAnswers, quizEnded, courseId]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  }, []);

  const handleOptionSelect = useCallback((optionKey) => {
    if (selectedOptionForDisplay === null) {
      setSelectedOptionForDisplay(optionKey);
      setSelectedAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questions[currentIndex].id]: optionKey
      }));
    }
  }, [selectedOptionForDisplay, currentIndex, questions]);

  // --- Robots (useEffect Hooks) that run automatically ---

  useEffect(() => {
    console.log("Robot 1: Fetching questions for course:", courseId);
    
    const fetchQuestions = async () => {
      try {
        const url = `${API_URL}/api/quiz/questions/${courseId}/`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        
        const data = await response.json();
        
        setQuestions(data);
        console.log("Robot 1: Questions fetched successfully!", data);
      } catch (error) {
        console.error("Robot 1: Failed to load questions:", error.message);
        Alert.alert("Error", "Failed to load quiz questions. Please try again later.");
      }
    };

    fetchQuestions();
  }, [courseId]);

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

  useEffect(() => {
    if (Object.keys(selectedAnswers).length === questions.length && questions.length > 0) {
      const delaySubmit = setTimeout(() => {
        finishQuizAndSubmit();
      }, 1500); 
      return () => clearTimeout(delaySubmit);
    } else if (Object.keys(selectedAnswers).length > currentIndex) {
      const delayNext = setTimeout(() => {
        handleNext();
      }, 1500); 
      return () => clearTimeout(delayNext);
    }
  }, [selectedAnswers, questions.length, currentIndex, finishQuizAndSubmit, handleNext]);


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // --- What You See on the Screen (The Display Part / JSX) ---

  if (questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Questions...</Text>
      </View>
    );
  }

  if (quizEnded) {
    const finalPercentage = Math.round((score / questions.length) * 100);
    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Quiz Completed!</Text>
        <View style={styles.resultsBox}>
          <Text style={styles.resultsSubtitle}>Your Results</Text>
          <Text style={styles.scoreText}>Score: {score}/{questions.length}</Text>
          <Text style={styles.percentageText}>Percentage: {finalPercentage}%</Text>
          {submissionResult && (
            <Text style={[styles.submissionText, submissionResult.includes('successfully') ? styles.successText : styles.errorText]}>
              {submissionResult}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => window.location.reload()}
        >
          <Text style={styles.retryButtonText}>Take Quiz Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <ScrollView contentContainerStyle={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>{courseId} Quiz</Text>
        <View>
          <Text style={[styles.timer, timeLeft < 10 && styles.timerDanger]}>
            Time: {formatTime(timeLeft)}
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Question {currentIndex + 1} of {questions.length}</Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBar, { width: `${((currentIndex + 1) / questions.length) * 100}%` }]}></View>
        </View>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionText}>
          {currentQuestion.question_text}
        </Text>
        <View style={styles.optionsContainer}>
          {Object.entries(currentQuestion.options).map(([key, value]) => {
            let optionStyle = styles.option;
            if (selectedOptionForDisplay) {
              if (key === currentQuestion.correct_answer) {
                optionStyle = [styles.option, styles.optionCorrect];
              } else if (key === selectedOptionForDisplay) {
                optionStyle = [styles.option, styles.optionIncorrect];
              }
            }

            return (
              <TouchableOpacity
                key={key}
                style={optionStyle}
                onPress={() => handleOptionSelect(key)}
                disabled={selectedOptionForDisplay !== null}
              >
                <Text style={styles.optionText}>
                  <Text style={styles.optionKey}>{key}.</Text> {value}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedOptionForDisplay && (
          <Text style={[styles.feedbackText, selectedOptionForDisplay === currentQuestion.correct_answer ? styles.correctFeedback : styles.wrongFeedback]}>
            {selectedOptionForDisplay === currentQuestion.correct_answer ? 'Correct!' : 'Wrong Answer'}
          </Text>
        )}
      </View>

      <View style={styles.submitContainer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={finishQuizAndSubmit}
        >
          <Text style={styles.submitButtonText}>Finish Quiz Early</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Part 4: The Stylesheet (Our Style Guide)
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  mainContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  timer: {
    backgroundColor: '#28a745',
    color: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  timerDanger: {
    backgroundColor: '#ff6b6b',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    marginBottom: 5,
  },
  progressBarBackground: {
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    height: 10,
  },
  progressBar: {
    backgroundColor: '#007bff',
    height: '100%',
    borderRadius: 10,
  },
  questionCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 25,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    lineHeight: 25,
    color: '#000',
  },
  optionsContainer: {
    marginBottom: 10,
  },
  option: {
    padding: 15,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  optionCorrect: {
    backgroundColor: 'lightgreen',
    borderColor: 'green',
  },
  optionIncorrect: {
    backgroundColor: 'salmon',
    borderColor: 'red',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  optionKey: {
    fontWeight: 'bold',
  },
  feedbackText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  correctFeedback: {
    color: 'green',
  },
  wrongFeedback: {
    color: 'red',
  },
  submitContainer: {
    alignItems: 'center',
  },
  submitButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ffc107',
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#212529',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultsBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginVertical: 20,
    width: '100%',
    alignItems: 'center',
  },
  resultsSubtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 24,
    marginVertical: 10,
  },
  percentageText: {
    fontSize: 18,
    marginVertical: 10,
  },
  submissionText: {
    marginVertical: 10,
    textAlign: 'center',
  },
  successText: {
    color: 'green',
  },
  errorText: {
    color: 'red',
  },
  retryButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginTop: 20,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default QuizScreen;