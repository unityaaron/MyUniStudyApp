import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const JobsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jobs & Scholarships</Text>
      <View style={styles.cardsContainer}>
        {/* Jobs Card */}
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('JobsPage')} 
        >
          <Ionicons name="cash-outline" size={80} color="black" />
          <Text style={styles.cardLabel}>Jobs</Text>
          <Text style={styles.cardCount}>Student Jobs HERE!</Text>
        </TouchableOpacity>

        {/* Scholarships Card */}
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('ScholarshipsPage')}
        >
          <Ionicons name="school-outline" size={80} color="black" />
          <Text style={styles.cardLabel}>Scholarships</Text>
          <Text style={styles.cardCount}>Student Scholarships HERE!</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // This will place the cards evenly
  },
  card: {
    width: '45%', // This makes the cards take up a little less than half the screen
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  cardCount: {
    fontSize: 14,
    color: '#666',
  },
});

export default JobsScreen;