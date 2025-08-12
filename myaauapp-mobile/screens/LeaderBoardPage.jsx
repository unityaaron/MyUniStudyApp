import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LeaderboardPage = ({ route }) => {
  // We get the course title from the navigation route.
  const { courseTitle } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard for {courseTitle}</Text>
      <Text style={styles.subtitle}>List of top scorers will be here!</Text>
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
  },
});

export default LeaderboardPage;