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

// 🟢 FIX: Create a function to get themed options for the stack navigators.
// This ensures that all screens inside the stacks get the correct background color.
const ThemedStackOptions = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return {
    headerShown: true, // We will show the header for all these screens
    cardStyle: {
      backgroundColor: isDark ? '#121212' : '#ffffff', // Set the screen background color
    },
  };
};

// === 3. Your Stack Navigator Functions (Updated with a fix) ===
function HomeStackScreen() {
  const themedOptions = ThemedStackOptions();
  return (
    // 🟢 FIX: Apply the themed options to the stack navigator.
    <HomeStack.Navigator screenOptions={themedOptions}>
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={({ navigation }) => ({
          header: (props) => <Header navigation={navigation} />,
          // 🟢 FIX: The Stack.Navigator has headerShown: true, so we can remove this line.
          // The custom header will now show up correctly.
          // headerShown: false,
        })}
      />
      <HomeStack.Screen
        name="Quiz"
        component={QuizScreen}
        options={({ navigation }) => ({
          header: (props) => <StackHeader {...props} title="Quiz" />,
          // 🟢 FIX: The Stack.Navigator has headerShown: true, so we can remove this line.
          // headerShown: true,
        })}
      />
    </HomeStack.Navigator>
  );
}

function JobsAndScholarshipsStackScreen() {
  const themedOptions = ThemedStackOptions();
  return (
    // 🟢 FIX: Apply the themed options to the stack navigator.
    <JobsStack.Navigator screenOptions={themedOptions}>
      <JobsStack.Screen
        name="JobsAndScholarships"
        component={JobsAndScholarshipsScreen}
        options={({ navigation }) => ({
          header: (props) => <Header navigation={navigation} />,
          // 🟢 FIX: Removed.
          // headerShown: false,
        })}
      />
      <JobsStack.Screen
        name="JobsPage"
        component={JobsPage}
        options={({ navigation }) => ({
          header: (props) => <StackHeader {...props} title="Jobs" />,
          // 🟢 FIX: Removed.
          // headerShown: true,
        })}
      />
      <JobsStack.Screen
        name="ScholarshipsPage"
        component={ScholarshipsPage}
        options={({ navigation }) => ({
          header: (props) => <StackHeader {...props} title="Scholarships" />,
          // 🟢 FIX: Removed.
          // headerShown: true,
        })}
      />
    </JobsStack.Navigator>
  );
}

function TopScorersStackScreen() {
  const themedOptions = ThemedStackOptions();
  return (
    // 🟢 FIX: Apply the themed options to the stack navigator.
    <TopScorersStack.Navigator screenOptions={themedOptions}>
      <TopScorersStack.Screen
        name="TopScorersHome"
        component={TopScorersScreen}
        options={({ navigation }) => ({
          header: (props) => <Header navigation={navigation} />,
          // 🟢 FIX: Removed.
          // headerShown: false,
        })}
      />
      <TopScorersStack.Screen
        name="LeaderboardPage"
        component={LeaderboardPage}
        options={({ navigation }) => ({
          header: (props) => <StackHeader {...props} title="Leaderboard" />,
          // 🟢 FIX: Removed.
          // headerShown: true,
        })}
      />
    </TopScorersStack.Navigator>
  );
}

function BuySellStackScreen() {
  const themedOptions = ThemedStackOptions();
  return (
    // 🟢 FIX: Apply the themed options to the stack navigator.
    <BuySellStack.Navigator screenOptions={themedOptions}>
      <BuySellStack.Screen
        name="BuySellHome"
        component={BuySellScreen}
        options={({ navigation }) => ({
          header: (props) => <Header navigation={navigation} />,
          // 🟢 FIX: Removed.
          // headerShown: false,
        })}
      />
      <BuySellStack.Screen
        name="MarketplacePage"
        component={MarketplacePage}
        options={({ navigation }) => ({
          header: (props) => <StackHeader {...props} title="Marketplace" />,
          // 🟢 FIX: Removed.
          // headerShown: true,
        })}
      />
      <BuySellStack.Screen
        name="SellerPage"
        component={SellerPage}
        options={({ navigation }) => ({
          header: (props) => <StackHeader {...props} title="Sell an Item" />,
          // 🟢 FIX: Removed.
          // headerShown: true,
        })}
      />
    </BuySellStack.Navigator>
  );
}

// === 4. Your Tab Navigator Function ===
function MainTabNavigator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        // 🟢 FIX: We no longer need to set a header on the Tab screens,
        // because the Stack Navigators handle the headers.
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
        tabBarStyle: {
          backgroundColor: isDark ? '#1F1F1F' : '#2E8B57',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Jobs & Scholarships" component={JobsAndScholarshipsStackScreen} />
      <Tab.Screen name="Top Scorers" component={TopScorersStackScreen} />
      <Tab.Screen name="Buy & Sell" component={BuySellStackScreen} />
    </Tab.Navigator>
  );
}

// === 5. The Main App Navigator (All the screens for a logged-in user) ===
function MainAppNavigator({ onLogout }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <AuthStack.Navigator screenOptions={{
      headerShown: false,
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