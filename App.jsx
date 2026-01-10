import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import screens
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen'; // Make sure this is imported

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholder for tabs we haven't built yet
const Placeholder = () => <></>;

function MainDashboard({ route }) {
  // --- FIX: Extract 'user' here so it can be used below ---
  // If route.params is undefined (e.g. during testing), default to a guest user
  const { user } = route.params || { user: { name: 'Guest', email: 'guest@example.com' } }; 

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Explore') iconName = focused ? 'compass' : 'compass-outline';
          else if (route.name === 'Add') iconName = 'add-circle';
          else if (route.name === 'Journey') iconName = focused ? 'journal' : 'journal-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

          if (route.name === 'Add') return <Ionicons name={iconName} size={48} color="#FFC107" style={{marginTop: -20}}/>;

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { height: 60, paddingBottom: 10 },
      })}
    >
      {/* Pass user to Home */}
      <Tab.Screen name="Home" component={HomeScreen} initialParams={{ user }} />
      
      <Tab.Screen name="Explore" component={Placeholder} />
      <Tab.Screen name="Add" component={Placeholder} options={{tabBarLabel:()=>null}}/>
      <Tab.Screen name="Journey" component={Placeholder} />
      
      {/* Pass user to Profile (Fixes your error) */}
      <Tab.Screen name="Profile" component={ProfileScreen} initialParams={{ user }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Dashboard" component={MainDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}