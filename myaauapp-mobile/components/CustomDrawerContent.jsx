import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// This is the component that will be the content of our sidebar.
// It receives the 'navigation' tool automatically.
const CustomDrawerContent = ({ navigation }) => {
  // We'll use a placeholder for now until we build the login logic.
  const isLoggedIn = false; 

  // Function to handle the navigation and close the sidebar
  const navigateAndClose = (screenName) => {
    navigation.navigate(screenName);
  };
  
  // This will be replaced later when we build login
  const handleLogoutClick = () => {
    console.log('Logging out...');
    navigateAndClose('MainTabs'); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.drawerHeader}>
        <TouchableOpacity onPress={() => navigation.closeDrawer()} style={styles.closeBtn}>
          <Ionicons name="close-circle-outline" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Profile</Text>
      </View>

      <View style={styles.drawerItems}>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => navigateAndClose('ProfilePage')} // Go to the main tabs, but we can make a Profile screen later
        >
          <Ionicons name="person-circle-outline" size={24} color="#555" />
          <Text style={styles.drawerItemText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => navigateAndClose('SettingsPage')} // We will create a Settings page later
        >
          <Ionicons name="settings-outline" size={24} color="#555" />
          <Text style={styles.drawerItemText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => navigateAndClose('MorePage')} // We will create a More page later
        >
          <Ionicons name="ellipsis-horizontal-circle-outline" size={24} color="#555" />
          <Text style={styles.drawerItemText}>More</Text>
        </TouchableOpacity>

        {isLoggedIn ? (
          <TouchableOpacity
            style={[styles.drawerItem, styles.logoutItem]}
            onPress={handleLogoutClick}
          >
            <Ionicons name="log-out-outline" size={24} color="red" />
            <Text style={[styles.drawerItemText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => navigateAndClose('LoginPage')} // We will create a Login page later
            >
              <Ionicons name="log-in-outline" size={24} color="#555" />
              <Text style={styles.drawerItemText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => navigateAndClose('RegisterPage')} // We will create a Register page later
            >
              <Ionicons name="person-add-outline" size={24} color="#555" />
              <Text style={styles.drawerItemText}>Register</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 40,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  closeBtn: {
    paddingRight: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  drawerItems: {
    flex: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  drawerItemText: {
    marginLeft: 15,
    fontSize: 18,
    color: '#555',
  },
  logoutItem: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  logoutText: {
    color: 'red',
  },
});

export default CustomDrawerContent;