import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// This is our data for the courses.
const courses = [
  { id: 'GST101', title: 'GST 101', questions: '100 questions' },
  { id: 'GST102', title: 'GST 102', questions: '100 questions' },
  { id: 'GST201', title: 'GST 201', questions: '100 questions' },
  { id: 'BIO101', title: 'BIO 101', questions: '100 questions' },
  { id: 'PHY101', title: 'PHY 101', questions: '100 questions' },
  { id: 'CHM101', title: 'CHM 101', questions: '100 questions' },
];

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Practice Questions</Text>
      <View style={styles.cardsContainer}>
        {courses.map((course) => (
          <TouchableOpacity 
            key={course.id} 
            style={styles.card}
            onPress={() => navigation.navigate('Quiz', { courseId: course.id })}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="book-outline" size={80} color="black" />
            </View>
            <Text style={styles.cardLabel}>{course.title}</Text>
            <Text style={styles.cardCount}>{course.questions}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardCount: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;