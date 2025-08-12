import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const QuizScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Page</Text>
      <Text style={styles.subtitle}>This is where the quiz will be!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
  }
});

export default QuizScreen;