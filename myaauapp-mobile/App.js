// App.js

// This is the main file for your app. It handles all the navigation logic
// and decides which pages to show based on if the user is logged in.

// === 1. The Tools We Need ===
import React, { useState, useEffect } from 'react'; // React's core tools.
import { StyleSheet, SafeAreaView, Text, View, ActivityIndicator } from 'react-native'; // Basic components for building a screen.
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // The navigator for the bottom tabs.
import { NavigationContainer } from '@react-navigation/native'; // The main container for all our navigation.
import { createStackNavigator } from '@react-navigation/stack'; // A navigator for screens that go on top of each other.
import { createDrawerNavigator } from '@react-navigation/drawer'; // The navigator for the side menu.
import AsyncStorage from '@react-native-async-storage/async-storage'; // Our tool for checking the login token.
import { Ionicons } from '@expo/vector-icons'; // The icons for our tab bar.

// We import all of your screen components here.
import Header from './components/Header';
import StackHeader from './components/StackHeader.jsx';
import CustomDrawerContent from './components/CustomDrawerContent.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import QuizScreen from './screens/QuizScreen.jsx';
import JobsAndScholarshipsScreen from './screens/JobsandScholarshipsScreen.jsx';
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
        tabBarStyle: {
          backgroundColor: '#2E8B57',
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
// We have to wrap all the parts of the main app in one place.
// ✅ We now give it an `onLogout` prop.
function MainAppNavigator({ onLogout }) {
  return (
    // ✅ We pass the `onLogout` function and the `isAuthenticated` state to the drawer content.
    // The `isAuthenticated` is now available here because we pass it from the main App component.
    <Drawer.Navigator screenOptions={{ headerShown: false }} drawerContent={props => <CustomDrawerContent {...props} onLogout={onLogout} isAuthenticated={true} />}>
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
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      {/* We use a different way to render the component so we can pass props */}
      <AuthStack.Screen name="Login">
        {props => <LoginPage {...props} onLoginSuccess={onLoginSuccess} />}
      </AuthStack.Screen>
      <AuthStack.Screen name="Register" component={RegisterPage} />
    </AuthStack.Navigator>
  );
}

// === 7. Our Main App Component ===
export default function App() {
  // We have two "sticky notes" to keep track of our app's status:
  const [isLoading, setIsLoading] = useState(true); // Is the app loading? Starts as true.
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Is the user logged in? Starts as false.

  // This is the new function that will be called to log the user out.
  // It removes the token and tells the app the user is no longer logged in.
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken'); // Erase the token.
      setIsAuthenticated(false); // Tell the app to go back to the login screen.
    } catch (e) {
      console.error("Failed to remove auth token", e);
    }
  };

  // This special effect runs only one time, right when the app starts.
  useEffect(() => {
    // This is a special function that checks for our login token in storage.
    const fetchToken = async () => {
      try {
        // We go and get the 'authToken' from the phone's storage.
        const token = await AsyncStorage.getItem('authToken');
        // If we found a token, we set our note to say the user is logged in.
        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (e) {
        // If something goes wrong, we log the error.
        console.error("Failed to fetch auth token", e);
        setIsAuthenticated(false);
      } finally {
        // No matter what happens, we are done loading, so we set this to false.
        setIsLoading(false);
      }
    };
    fetchToken(); // We call our function to start the process.
  }, []); // The empty list `[]` means this will only run when the app first opens.

  // If the app is still loading, we show a spinning circle.
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Checking login status...</Text>
      </View>
    );
  }

  // Once we are done loading, we show the correct navigator.
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        {isAuthenticated ? (
          // ✅ If `isAuthenticated` is true, we show our main app.
          // We pass our `handleLogout` function here.
          <MainAppNavigator onLogout={handleLogout} />
        ) : (
          // ❌ If `isAuthenticated` is false, we show the login/register pages.
          <AuthStackScreen onLoginSuccess={() => setIsAuthenticated(true)} />
        )}
      </NavigationContainer>
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
