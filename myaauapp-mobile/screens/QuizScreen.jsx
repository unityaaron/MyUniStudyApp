// screens/QuizScreen.jsx

// Part 1: Bring in the Tools (React Native Building Blocks)
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/api';
// 🟢 FIX: Import the useTheme hook
import { useTheme } from '../components/ThemeProvider';


// Part 2: Create our React Page Component
const QuizScreen = () => {
  const route = useRoute();
  const { courseId } = route.params;
  // 🟢 FIX: Use the theme hook to get the current theme
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
  const currentQuestion = questions[currentIndex];

  // 🟢 FIX: Create a dynamic styles object based on the theme.
  const themedStyles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#121212' : '#f0f4f7',
    },
    loadingText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDark ? '#f0f4f7' : '#000',
    },
    mainContainer: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: isDark ? '#121212' : '#f0f4f7',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      backgroundColor: isDark ? '#1f1f1f' : '#fff',
      borderRadius: 10,
      marginBottom: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#000',
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
      color: isDark ? '#f0f4f7' : '#000',
    },
    progressBarBackground: {
      width: '100%',
      backgroundColor: isDark ? '#444' : '#e0e0e0',
      borderRadius: 10,
      height: 10,
    },
    progressBar: {
      backgroundColor: '#007bff',
      height: '100%',
      borderRadius: 10,
    },
    questionCard: {
      backgroundColor: isDark ? '#1f1f1f' : 'white',
      borderWidth: 1,
      borderColor: isDark ? '#333' : '#ddd',
      borderRadius: 10,
      padding: 25,
      marginBottom: 20,
    },
    questionText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
      lineHeight: 25,
      color: isDark ? '#fff' : '#000',
    },
    optionsContainer: {
      marginBottom: 10,
    },
    option: {
      padding: 15,
      borderWidth: 2,
      borderColor: isDark ? '#444' : '#e0e0e0',
      borderRadius: 8,
      marginBottom: 15,
      backgroundColor: isDark ? '#2a2a2a' : 'white',
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
      color: isDark ? '#fff' : '#000',
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
      backgroundColor: isDark ? '#f0c107' : '#ffc107',
      borderRadius: 5,
    },
    submitButtonText: {
      color: isDark ? '#121212' : '#212529',
      fontSize: 14,
      fontWeight: 'bold',
    },
    resultsContainer: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#121212' : '#f0f4f7',
    },
    resultsTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 20,
      color: isDark ? '#fff' : '#000',
    },
    resultsBox: {
      backgroundColor: isDark ? '#1f1f1f' : '#fff',
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
      color: isDark ? '#fff' : '#000',
    },
    scoreText: {
      fontSize: 24,
      marginVertical: 10,
      color: isDark ? '#fff' : '#000',
    },
    percentageText: {
      fontSize: 18,
      marginVertical: 10,
      color: isDark ? '#fff' : '#000',
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


  if (questions.length === 0) {
    return (
      // 🟢 FIX: Use the new themed styles
      <View style={themedStyles.loadingContainer}>
        <Text style={themedStyles.loadingText}>Loading Questions...</Text>
      </View>
    );
  }

  if (quizEnded) {
    const finalPercentage = Math.round((score / questions.length) * 100);
    return (
      // 🟢 FIX: Use the new themed styles
      <View style={themedStyles.resultsContainer}>
        <Text style={themedStyles.resultsTitle}>Quiz Completed!</Text>
        <View style={themedStyles.resultsBox}>
          <Text style={themedStyles.resultsSubtitle}>Your Results</Text>
          <Text style={themedStyles.scoreText}>Score: {score}/{questions.length}</Text>
          <Text style={themedStyles.percentageText}>Percentage: {finalPercentage}%</Text>
          {submissionResult && (
            <Text style={[themedStyles.submissionText, submissionResult.includes('successfully') ? themedStyles.successText : themedStyles.errorText]}>
              {submissionResult}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={themedStyles.retryButton}
          onPress={() => window.location.reload()}
        >
          <Text style={themedStyles.retryButtonText}>Take Quiz Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    // 🟢 FIX: Use the new themed styles
    <ScrollView contentContainerStyle={themedStyles.mainContainer}>
      <View style={themedStyles.header}>
        <Text style={themedStyles.title}>{courseId} Quiz</Text>
        <View>
          <Text style={[themedStyles.timer, timeLeft < 10 && themedStyles.timerDanger]}>
            Time: {formatTime(timeLeft)}
          </Text>
        </View>
      </View>

      <View style={themedStyles.progressContainer}>
        <Text style={themedStyles.progressText}>Question {currentIndex + 1} of {questions.length}</Text>
        <View style={themedStyles.progressBarBackground}>
          <View style={[themedStyles.progressBar, { width: `${((currentIndex + 1) / questions.length) * 100}%` }]}></View>
        </View>
      </View>

      <View style={themedStyles.questionCard}>
        <Text style={themedStyles.questionText}>
          {currentQuestion.question_text}
        </Text>
        <View style={themedStyles.optionsContainer}>
          {Object.entries(currentQuestion.options).map(([key, value]) => {
            let optionStyle = themedStyles.option;
            if (selectedOptionForDisplay) {
              if (key === currentQuestion.correct_answer) {
                optionStyle = [themedStyles.option, themedStyles.optionCorrect];
              } else if (key === selectedOptionForDisplay) {
                optionStyle = [themedStyles.option, themedStyles.optionIncorrect];
              }
            }

            return (
              <TouchableOpacity
                key={key}
                style={optionStyle}
                onPress={() => handleOptionSelect(key)}
                disabled={selectedOptionForDisplay !== null}
              >
                <Text style={themedStyles.optionText}>
                  <Text style={themedStyles.optionKey}>{key}.</Text> {value}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedOptionForDisplay && (
          <Text style={[themedStyles.feedbackText, selectedOptionForDisplay === currentQuestion.correct_answer ? themedStyles.correctFeedback : themedStyles.wrongFeedback]}>
            {selectedOptionForDisplay === currentQuestion.correct_answer ? 'Correct!' : 'Wrong Answer'}
          </Text>
        )}
      </View>

      <View style={themedStyles.submitContainer}>
        <TouchableOpacity
          style={themedStyles.submitButton}
          onPress={finishQuizAndSubmit}
        >
          <Text style={themedStyles.submitButtonText}>Finish Quiz Early</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default QuizScreen;