import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

// We now accept props!
// 'navigation' is for moving between screens.
// 'isAuthenticated' is the sticky note from App.js.
// 'onLogout' is the function we will call to log out.
const CustomDrawerContent = (props) => {
  // Let's get these props from the list of props that are passed.
  const { navigation, isAuthenticated, onLogout } = props;

  // This function will now clear the token and then close the sidebar.
  const handleLogoutClick = async () => {
    console.log('Logging out...');
    await onLogout(); // This will clear the token and update the app state.
    navigation.closeDrawer(); // We close the sidebar after logging out.
  };

  return (
    // DrawerContentScrollView lets us scroll if we have many items.
    <DrawerContentScrollView {...props}>
      <View style={styles.container}>
        <View style={styles.drawerHeader}>
          {/* ... the rest of your header code is unchanged ... */}
          <TouchableOpacity onPress={() => navigation.closeDrawer()} style={styles.closeBtn}>
            <Ionicons name="close-circle-outline" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerText}>My Profile</Text>
        </View>

        <View style={styles.drawerItems}>
          {/* We use a conditional check to show different buttons. */}
          {isAuthenticated ? (
            // If the user is logged in, show these options
            <View>
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navigation.navigate('ProfilePage')} 
              >
                <Ionicons name="person-circle-outline" size={24} color="#555" />
                <Text style={styles.drawerItemText}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navigation.navigate('SettingsPage')} 
              >
                <Ionicons name="settings-outline" size={24} color="#555" />
                <Text style={styles.drawerItemText}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navigation.navigate('MorePage')} 
              >
                <Ionicons name="ellipsis-horizontal-circle-outline" size={24} color="#555" />
                <Text style={styles.drawerItemText}>More</Text>
              </TouchableOpacity>
              {/* This is the new Logout button. */}
              <TouchableOpacity
                style={[styles.drawerItem, styles.logoutItem]}
                onPress={handleLogoutClick}
              >
                <Ionicons name="log-out-outline" size={24} color="red" />
                <Text style={[styles.drawerItemText, styles.logoutText]}>Logout</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // If the user is NOT logged in, show these options
            <View>
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navigation.navigate('Login')}
              >
                <Ionicons name="log-in-outline" size={24} color="#555" />
                <Text style={styles.drawerItemText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navigation.navigate('Register')}
              >
                <Ionicons name="person-add-outline" size={24} color="#555" />
                <Text style={styles.drawerItemText}>Register</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </DrawerContentScrollView>
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
