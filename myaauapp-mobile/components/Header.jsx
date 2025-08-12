import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ toggleSidebar }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={toggleSidebar} style={styles.menuIcon}>
        <Ionicons name="menu-outline" size={28} color="white" />
      </TouchableOpacity>
      <Text style={styles.headerText}>My UniStudy App</Text>
      <View style={{ width: 28 }}></View> 
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    backgroundColor: '#2E8B57', // Deep green color from your screenshot
    paddingHorizontal: 15,
    height: 60, 
    width: '100%',
  },
  menuIcon: {
    // We can add some styles here if needed, like padding
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Header;