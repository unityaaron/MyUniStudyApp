import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useTheme } from './ThemeProvider';

const CustomDrawerContent = (props) => {
  const { navigation, isAuthenticated, onLogout } = props;
  
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleLogoutClick = async () => {
    console.log('Logging out...');
    await onLogout();
    navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={isDark ? styles.containerDark : styles.containerLight}>
      <View style={styles.container}>
        <View style={[styles.drawerHeader, isDark ? styles.drawerHeaderDark : styles.drawerHeaderLight]}>
          <TouchableOpacity onPress={() => navigation.closeDrawer()} style={styles.closeBtn}>
            <Ionicons name="close-circle-outline" size={28} color={isDark ? '#fff' : '#333'} />
          </TouchableOpacity>
          <Text style={[styles.headerText, isDark ? styles.textDark : styles.textLight]}>My Profile</Text>
        </View>

        <View style={styles.drawerItems}>
          {isAuthenticated ? (
            <View>
              <TouchableOpacity
                style={[styles.drawerItem, isDark ? styles.drawerItemDark : styles.drawerItemLight]}
                onPress={() => navigation.navigate('ProfilePage')} 
              >
                <Ionicons name="person-circle-outline" size={24} color={isDark ? '#ddd' : '#555'} />
                <Text style={[styles.drawerItemText, isDark ? styles.textDark : styles.textLight]}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.drawerItem, isDark ? styles.drawerItemDark : styles.drawerItemLight]}
                onPress={() => navigation.navigate('SettingsPage')} 
              >
                <Ionicons name="settings-outline" size={24} color={isDark ? '#ddd' : '#555'} />
                <Text style={[styles.drawerItemText, isDark ? styles.textDark : styles.textLight]}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.drawerItem, isDark ? styles.drawerItemDark : styles.drawerItemLight]}
                onPress={() => navigation.navigate('MorePage')} 
              >
                <Ionicons name="ellipsis-horizontal-circle-outline" size={24} color={isDark ? '#ddd' : '#555'} />
                <Text style={[styles.drawerItemText, isDark ? styles.textDark : styles.textLight]}>More</Text>
              </TouchableOpacity>
              <TouchableOpacity
                // 🟢 FIX: We now use a new style that specifically sets the border color for the theme.
                style={[styles.drawerItem, styles.logoutItem, isDark ? styles.logoutItemDark : styles.logoutItemLight]}
                onPress={handleLogoutClick}
              >
                <Ionicons name="log-out-outline" size={24} color="#f44336" />
                <Text style={[styles.drawerItemText, styles.logoutText]}>Logout</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <TouchableOpacity
                style={[styles.drawerItem, isDark ? styles.drawerItemDark : styles.drawerItemLight]}
                onPress={() => navigation.navigate('Login')}
              >
                <Ionicons name="log-in-outline" size={24} color={isDark ? '#ddd' : '#555'} />
                <Text style={[styles.drawerItemText, isDark ? styles.textDark : styles.textLight]}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.drawerItem, isDark ? styles.drawerItemDark : styles.drawerItemLight]}
                onPress={() => navigation.navigate('Register')}
              >
                <Ionicons name="person-add-outline" size={24} color={isDark ? '#ddd' : '#555'} />
                <Text style={[styles.drawerItemText, isDark ? styles.textDark : styles.textLight]}>Register</Text>
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
    paddingTop: 40,
  },
  containerLight: { backgroundColor: 'white' },
  containerDark: { backgroundColor: '#121212' },

  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  drawerHeaderLight: { borderBottomColor: '#eee' },
  drawerHeaderDark: { borderBottomColor: '#2C2C2C' },
  
  closeBtn: {
    paddingRight: 15,
  },

  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textLight: { color: 'black' },
  textDark: { color: 'white' },

  drawerItems: {
    flex: 1,
  },

  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  drawerItemLight: { borderBottomColor: '#f0f0f0' },
  drawerItemDark: { borderBottomColor: '#2C2C2C' },
  
  drawerItemText: {
    marginLeft: 15,
    fontSize: 18,
  },

  logoutItem: {
    marginTop: 0,
    borderBottomWidth: 0,
  },

  logoutText: {
    color: 'red',
  },
});

export default CustomDrawerContent;