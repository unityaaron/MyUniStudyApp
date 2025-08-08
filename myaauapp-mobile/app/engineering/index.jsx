// app/engineering/index.jsx
import { Text, View, StyleSheet } from 'react-native';

export default function EngineeringPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Engineering courses page!</Text>
    </View>
  );
}

// We can give this page a slightly different style to tell them apart easily.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f0f5', // A lighter blue background
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004a80',
  },
});
