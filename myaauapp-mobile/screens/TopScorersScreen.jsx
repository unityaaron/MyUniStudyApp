import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const courses = [
  { id: '1', title: 'GST 101' },
  { id: '2', title: 'GST 102' },
  { id: '3', title: 'GST 201' },
  { id: '4', title: 'BIO 101' },
  { id: '5', title: 'CHM 101' },
  { id: '6', title: 'PHY 101' },
];

const TopScorersScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.courseButton}
      onPress={() => console.log(`Go to Leaderboard for ${item.title}`)}
    >
      <Text style={styles.courseButtonText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LeaderBoard for Courses</Text>
      <Text style={styles.subtitle}>Click on Courses to see Highest Scorers</Text>
      <FlatList
        data={courses}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </View>
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
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  list: {
    marginTop: 10,
  },
  courseButton: {
    backgroundColor: '#7BCCAD',
    padding: 15,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: 'center',
  },
  courseButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TopScorersScreen;