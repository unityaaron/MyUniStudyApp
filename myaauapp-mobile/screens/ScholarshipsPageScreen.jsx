import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScholarshipsPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Scholarships</Text>
      <Text style={styles.subtitle}>List of scholarships will be here!</Text>
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

export default ScholarshipsPage;