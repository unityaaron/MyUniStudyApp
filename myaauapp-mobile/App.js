import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';

// We import our screen components here.
import Header from './components/Header';
import HomeScreen from './screens/HomeScreen.jsx';
import QuizScreen from './screens/QuizScreen.jsx';
import JobsAndScholarshipsScreen from './screens/JobsandScholarshipsScreen.jsx';
import JobsPage from './screens/JobsPageScreen.jsx';
import ScholarshipsPage from './screens/ScholarshipsPageScreen.jsx';
import BuySellScreen from './screens/BuySellScreen.jsx';


// This creates our bottom tabs navigator.
const Tab = createBottomTabNavigator();

// This creates the stack navigator that manages screens for the Home tab.
const HomeStack = createStackNavigator();

// This component is the "manager" for the Home tab.
function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <HomeStack.Screen 
        name="Quiz" 
        component={QuizScreen} 
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

// THIS IS OUR NEW STACK FOR THE JOBS TAB!
const JobsStack = createStackNavigator();

// This is the new "manager" component for the Jobs & Scholarships tab.
function JobsAndScholarshipsStackScreen() {
  return (
    <JobsStack.Navigator>
      <JobsStack.Screen
        name="JobsAndScholarships"
        component={JobsAndScholarshipsScreen}
        options={{ headerShown: false }}
      />
      {/* ADD THESE TWO NEW LINES: */}
      <JobsStack.Screen
        name="JobsPage"
        component={JobsPage}
        options={{ headerShown: false }}
      />
      <JobsStack.Screen
        name="ScholarshipsPage"
        component={ScholarshipsPage}
        options={{ headerShown: false }}
      />
    </JobsStack.Navigator>
  );
}

const TopScorersStack = createStackNavigator();

function TopScorersStackScreen() {
  return (
    <TopScorersStack.Navigator>
      <TopScorersStack.Screen
        name="TopScorersHome"
        component={TopScorersScreen}
        options={{ headerShown: false }}
      />
      {/* We will add a Leaderboard page here later */}
    </TopScorersStack.Navigator>
  );
}

const BuySellStack = createStackNavigator();

function BuySellStackScreen() {
  return (
    <BuySellStack.Navigator>
      <BuySellStack.Screen
        name="BuySellHome"
        component={BuySellScreen}
        options={{ headerShown: false }}
      />
      {/* We will add a Marketplace and Seller page here later */}
    </BuySellStack.Navigator>
  );
}

// This is our main App component that ties everything together.
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          header: () => <Header />,
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
        {/* We use our HomeStackScreen component for the Home tab */}
        <Tab.Screen name="Home" component={HomeStackScreen} />
        {/* We use our NEW JobsAndScholarshipsStackScreen for this tab */}
        <Tab.Screen name="Jobs & Scholarships" component={JobsAndScholarshipsStackScreen} />
        <Tab.Screen name="Top Scorers" component={TopScorersStackScreen} />
        <Tab.Screen name="Buy & Sell" component={BuySellStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});