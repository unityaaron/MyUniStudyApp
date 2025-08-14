// screens/MoreScreen.jsx

// Part 1: Bring in the Tools (React Native building blocks)
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
// We need to import the FontAwesome icon set from react-native-vector-icons
import Icon from 'react-native-vector-icons/FontAwesome';

// Part 2: Create our React Screen Component
const MorePage = () => {
  // Part 3: What You See on the Screen (The Display Part)
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>More Options</Text>

      {/* Contact Support Section */}
      <View style={styles.section}>
        <View style={styles.iconContainer}>
          <Icon name="phone" size={20} color="#000" />
          <Text style={styles.label}>Contact Support</Text>
        </View>
        <Text style={styles.paragraph}>
          Founder's phone number: 08065907350
        </Text>
      </View>

      {/* About the App Section */}
      <View style={styles.section}>
        <View style={styles.iconContainer}>
          <Icon name="book" size={20} color="#000" />
          <Text style={styles.label}>About the App</Text>
        </View>
        <Text style={styles.paragraph}>
          This App was created by an Alumni of Ambrose Alli University Ekpoma. 
          He studied Agricultural Economics & Extension Service which is not close to the knowledge of a Computer Science Degree 
          and had no prior knowlegde on Software Development. It was just self-motivation, determination, belief and God.
          While still a student there were no test/exam question practice app to prepare for exams or tests which could make students score higher. 
          This was how the idea came about after months of studying on how to become a Software Engineer.
        </Text>
      </View>

      {/* Help & FAQ Section */}
      <View style={styles.section}>
        <View style={styles.iconContainer}>
          <Icon name="question-circle" size={20} color="#000" />
          <Text style={styles.label}>Help & FAQ</Text>
        </View>
        <Text style={styles.paragraph}>None</Text>
      </View>
    </ScrollView>
  );
};

// Part 4: The Stylesheet (Our Style Guide)
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
});

export default MorePage;
