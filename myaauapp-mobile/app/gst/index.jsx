// app/gst/index.jsx
import { Text, View, StyleSheet } from 'react-native';

export default function GstPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the GST courses page!</Text>
    </View>
  );
}

// Just like before, we add some styles to make the page look good.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7', // A slightly different background color
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});
