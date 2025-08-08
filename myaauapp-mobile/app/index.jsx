// app/index.jsx
import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>Hello, AAU GST App Home Page!</Text>
      
      {/* Button for the GST page */}
      <Link href="/gst" style={styles.button}>
        <Text style={styles.buttonText}>Go to GST Page</Text>
      </Link>

      {/* Button for the new Engineering page, using an array of styles */}
      <Link href="/engineering" style={[styles.button, styles.secondaryButton]}>
        <Text style={styles.buttonText}>Go to Engineering Page</Text>
      </Link>
    </View>
  );
}

// We've added a new style for the second button.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headingText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007aff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10, // Added space between the two buttons
    minWidth: 200, // Makes the buttons a consistent width
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#34c759', // A nice green color for the second button
  },
});
