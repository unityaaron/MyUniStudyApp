// App.js

// === 1. The Tools We Need ===
import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Text, View, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
// ⚠️ We need to make sure to import both the ThemeProvider and useTheme hook.
import { ThemeProvider, useTheme } from './components/ThemeProvider';

// We import all of your screen components here.
import Header from './components/Header';
import StackHeader from './components/StackHeader.jsx';
import CustomDrawerContent from './components/CustomDrawerContent.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import QuizScreen from './screens/QuizScreen.jsx';
import JobsAndScholarshipsScreen from './screens/JobsAndScholarshipsScreen.jsx';
import JobsPage from './screens/JobsPageScreen.jsx';
import ScholarshipsPage from './screens/ScholarshipsPageScreen.jsx';
import TopScorersScreen from './screens/TopScorersScreen.jsx';
import BuySellScreen from './screens/BuySellScreen.jsx';
import LeaderboardPage from './screens/LeaderBoardPage.jsx';
import ProfilePage from './screens/ProfilePage.jsx';
import SettingsPage from './screens/SettingsPage.jsx';
import MorePage from './screens/MorePage.jsx';
import LoginPage from './screens/LoginPage.jsx';
import RegisterPage from './screens/RegisterPage.jsx';
import MarketplacePage from './screens/MarketplacePage.jsx';
import SellerPage from './screens/SellerPage.jsx';

// === 2. The Navigators We Will Use ===
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const HomeStack = createStackNavigator();
const JobsStack = createStackNavigator();
const TopScorersStack = createStackNavigator();
const BuySellStack = createStackNavigator();
const AuthStack = createStackNavigator();

// === 3. Your Stack Navigator Functions (They are not changing) ===
function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={({ navigation }) => ({
          header: (props) => <Header navigation={navigation} />,
          headerShown: false,
        })}
      />
      <HomeStack.Screen
        name="Quiz"
        component={QuizScreen}
        options={({ navigation }) => ({
          header: (props) => <StackHeader {...props} title="Quiz" />,
          headerShown: true,
        })}
      />
    </HomeStack.Navigator>
  );
}

function JobsAndScholarshipsStackScreen() {
  return (
    <JobsStack.Navigator>
      <JobsStack.Screen
        name="JobsAndScholarships"
        component={JobsAndScholarshipsScreen}
        options={({ navigation }) => ({
          header: (props) => <Header navigation={navigation} />,
          headerShown: false,
        })}
      />
      <JobsStack.Screen
        name="JobsPage"
        component={JobsPage}
        options={({ navigation }) => ({
          header: (props) => <StackHeader {...props} title="Jobs" />,
          headerShown: true,
        })}
      />
      <JobsStack.Screen
        name="ScholarshipsPage"
        component={ScholarshipsPage}
        options={({ navigation }) => ({
          header: (props) => <StackHeader {...props} title="Scholarships" />,
          headerShown: true,
        })}
      />
    </JobsStack.Navigator>
  );
}

function TopScorersStackScreen() {
  return (
    <TopScorersStack.Navigator>
      <TopScorersStack.Screen
        name="TopScorersHome"
        component={TopScorersScreen}
        options={({ navigation }) => ({
          header: (props) => <Header navigation={navigation} />,
          headerShown: false,
        })}
      />
      <TopScorersStack.Screen
        name="LeaderboardPage"
        component={LeaderboardPage}
        options={({ navigation }) => ({
          header: (props) => <StackHeader {...props} title="Leaderboard" />,
          headerShown: true,
        })}
      />
    </TopScorersStack.Navigator>
  );
}

function BuySellStackScreen() {
  return (
    <BuySellStack.Navigator>
      <BuySellStack.Screen
        name="BuySellHome"
        component={BuySellScreen}
        options={({ navigation }) => ({
          header: (props) => <Header navigation={navigation} />,
          headerShown: false,
        })}
      />
      <BuySellStack.Screen
        name="MarketplacePage"
        component={MarketplacePage}
        options={({ navigation }) => ({
          header: (props) => <StackHeader {...props} title="Marketplace" />,
          headerShown: true,
        })}
      />
      <BuySellStack.Screen
        name="SellerPage"
        component={SellerPage}
        options={({ navigation }) => ({
          header: (props) => <StackHeader {...props} title="Sell an Item" />,
          headerShown: true,
        })}
      />
    </BuySellStack.Navigator>
  );
}

// === 4. Your Tab Navigator Function ===
function MainTabNavigator() {
  // 🟢 We use the useTheme hook here to get the theme
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Jobs & Scholarships') {
            iconName = focused ? 'school' : 'school-outline';
          } else if (route.name === 'Top Scorers') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Buy & Sell') {
            iconName = focused ? 'basket' : 'basket-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'yellow',
        tabBarInactiveTintColor: 'white',
        // 🟢 We change the background color of the tab bar based on the theme
        tabBarStyle: {
          backgroundColor: isDark ? '#1F1F1F' : '#2E8B57',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={({ navigation }) => ({
          header: (props) => <Header navigation={navigation} />,
          headerShown: true,
        })}
      />
      <Tab.Screen
        name="Jobs & Scholarships"
        component={JobsAndScholarshipsStackScreen}
        options={({ navigation }) => ({
          header: (props) => <Header navigation={navigation} />,
          headerShown: true,
        })}
      />
      <Tab.Screen
        name="Top Scorers"
        component={TopScorersStackScreen}
        options={({ navigation }) => ({
          header: (props) => <Header navigation={navigation} />,
          headerShown: true,
        })}
      />
      <Tab.Screen
        name="Buy & Sell"
        component={BuySellStackScreen}
        options={({ navigation }) => ({
          header: (props) => <Header navigation={navigation} />,
          headerShown: true,
        })}
      />
    </Tab.Navigator>
  );
}

// === 5. The Main App Navigator (All the screens for a logged-in user) ===
function MainAppNavigator({ onLogout }) {
  // 🟢 We use the useTheme hook here as well
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Drawer.Navigator 
      screenOptions={{ 
        headerShown: false,
        // 🟢 We apply the theme to the drawer's background color
        drawerStyle: {
          backgroundColor: isDark ? '#121212' : '#ffffff',
        },
      }} 
      drawerContent={props => <CustomDrawerContent {...props} onLogout={onLogout} isAuthenticated={true} />}
    >
      <Drawer.Screen name="MainTabs" component={MainTabNavigator} />
      <Drawer.Screen
        name="ProfilePage"
        component={ProfilePage}
        options={({ navigation }) => ({
          header: (props) => <StackHeader {...props} title="My Profile" />,
          headerShown: true,
        })}
      />
      <Drawer.Screen
        name="SettingsPage"
        component={SettingsPage}
        options={({ navigation }) => ({
          header: (props) => <StackHeader {...props} title="Settings" />,
          headerShown: true,
        })}
      />
      <Drawer.Screen
        name="MorePage"
        component={MorePage}
        options={({ navigation }) => ({
          header: (props) => <StackHeader {...props} title="More" />,
          headerShown: true,
        })}
      />
    </Drawer.Navigator>
  );
}

// === 6. The Auth Navigator (For users who are not logged in) ===
function AuthStackScreen({ onLoginSuccess }) {
  // 🟢 We use the useTheme hook here as well
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <AuthStack.Navigator screenOptions={{ 
      headerShown: false,
      // 🟢 Apply the theme to the stack's background
      cardStyle: {
        backgroundColor: isDark ? '#121212' : '#f0f4f7'
      }
    }}>
      <AuthStack.Screen name="Login">
        {props => <LoginPage {...props} onLoginSuccess={onLoginSuccess} />}
      </AuthStack.Screen>
      <AuthStack.Screen name="Register" component={RegisterPage} />
    </AuthStack.Navigator>
  );
}

// === 7. Our Main App Component ===
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setIsAuthenticated(false);
    } catch (e) {
      console.error("Failed to remove auth token", e);
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (e) {
        console.error("Failed to fetch auth token", e);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchToken();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Checking login status...</Text>
      </View>
    );
  }

  // 🟢 The ThemeProvider is now wrapping the entire app.
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemeProvider>
        <NavigationContainer>
          {isAuthenticated ? (
            <MainAppNavigator onLogout={handleLogout} />
          ) : (
            <AuthStackScreen onLoginSuccess={() => setIsAuthenticated(true)} />
          )}
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaView>
  );
}

// Simple styles for the loading screen.
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});
