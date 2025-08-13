import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StackHeader = ({ navigation, title }) => {
  return (
    <View style={styles.header}>
      {/* Back button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>
      {/* Title */}
      <Text style={styles.headerText}>{title}</Text>
      {/* A blank space to keep the title centered */}
      <View style={{ width: 28 }}></View> 
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2E8B57',
    paddingHorizontal: 15,
    height: 60,
    width: '100%',
  },
  backButton: {
    paddingRight: 15,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default StackHeader;