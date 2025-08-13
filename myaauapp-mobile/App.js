import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

// We import our screen components here.
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


// These are our navigators.
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const HomeStack = createStackNavigator();
const JobsStack = createStackNavigator();
const TopScorersStack = createStackNavigator();
const BuySellStack = createStackNavigator();

// These are all of your stack navigator functions. They are not changing.
function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          header: (props) => <Header navigation={navigation} />,
          headerShown: false, // Make sure this is false
        })}
      />
      <HomeStack.Screen
        name="Quiz"
        component={QuizScreen}
        options={({ navigation }) => ({
          header: (props) => <StackHeader {...props} title="Quiz" />,
          headerShown: true, // This needs to be true so the header shows
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
          headerShown: false, // Make sure this is false
        })}
      />
      <JobsStack.Screen
        name="JobsPage"
        component={JobsPage}
        options={({ navigation }) => ({
          header: (props) => <StackHeader {...props} title="Jobs" />,
          headerShown: true, // This needs to be true so the header shows
        })}
      />
      <JobsStack.Screen
        name="ScholarshipsPage"
        component={ScholarshipsPage}
        options={({ navigation }) => ({
          header: (props) => <StackHeader {...props} title="Scholarships" />,
          headerShown: true, // This needs to be true so the header shows
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
          headerShown: false, // Make sure this is false
        })}
      />
      <TopScorersStack.Screen
        name="LeaderboardPage"
        component={LeaderboardPage}
        options={({ navigation }) => ({
          header: (props) => <StackHeader {...props} title="Leaderboard" />,
          headerShown: true, // This needs to be true so the header shows
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
          headerShown: false, // Make sure this is false
        })}
      />
      <BuySellStack.Screen
        name="MarketplacePage"
        component={MarketplacePage}
        options={({ navigation }) => ({
          header: (props) => <StackHeader {...props} title="Marketplace" />,
          headerShown: true, // This needs to be true so the header shows
        })}
      />
      <BuySellStack.Screen
        name="SellerPage"
        component={SellerPage}
        options={({ navigation }) => ({
          header: (props) => <StackHeader {...props} title="Sell an Item" />,
          headerShown: true, // This needs to be true so the header shows
        })}
      />
    </BuySellStack.Navigator>
  );
}

// This is a new component.
// It holds all of our tabs and their screens.
function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false, // This is the key. Tell the tab navigator not to show a header.
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
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Jobs & Scholarships" component={JobsAndScholarshipsStackScreen} />
      <Tab.Screen name="Top Scorers" component={TopScorersStackScreen} />
      <Tab.Screen name="Buy & Sell" component={BuySellStackScreen} />
    </Tab.Navigator>
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

// THIS IS THE NEW FINAL PART.
// We put the NavigationContainer first, then the Drawer, and then our tabs inside.
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator screenOptions={{ headerShown: false }} drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="MainTabs" component={MainTabNavigator} />
        
        <Drawer.Screen 
          name="ProfilePage" 
          component={ProfilePage} 
          options={({ navigation }) => ({
            header: (props) => <StackHeader {...props} title="My Profile" />,
            headerShown: true, // This needs to be true so the header shows
          })}
        />
        <Drawer.Screen 
          name="SettingsPage" 
          component={SettingsPage} 
          options={({ navigation }) => ({
            header: (props) => <StackHeader {...props} title="Settings" />,
            headerShown: true, // This needs to be true so the header shows
          })}
        />
        <Drawer.Screen 
          name="MorePage" 
          component={MorePage} 
          options={({ navigation }) => ({
            header: (props) => <StackHeader {...props} title="More" />,
            headerShown: true, // This needs to be true so the header shows
          })}
        />
        <Drawer.Screen 
          name="LoginPage" 
          component={LoginPage} 
          options={({ navigation }) => ({
            header: (props) => <StackHeader {...props} title="Login" />,
            headerShown: true, // This needs to be true so the header shows
          })}
        />
        <Drawer.Screen 
          name="RegisterPage" 
          component={RegisterPage} 
          options={({ navigation }) => ({
            header: (props) => <StackHeader {...props} title="Register" />,
            headerShown: true, // This needs to be true so the header shows
          })}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}