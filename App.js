import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Animated, Easing, StyleSheet, Image, View, Text } from 'react-native';

// Screens
import SplashScreen from './SplashScreen';
import LoginScreenView from './LoginScreenView';
import RegisterScreenView from './RegisterScreen';
import CalendarMain from './calendarmain';
import DateExpenses from './dateExpenses';
import FireNumber from './FireNumber';
import Simulator from './Simulator';
import Profile from './Profile';
import Income from './Income';
import Expenses from './Expenses';
import Investment from './Investment';
import PremiumSubscription from './Payement';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const getTabBarIcon = (route, color, size) => {
  const icons = {
    Calendar: <Ionicons name="calendar-outline" size={size} color={color} />,
    FireNumber: <Ionicons name="calculator-outline" size={size} color={color} />,
    Simulator: <MaterialIcons name="trending-up" size={size} color={color} />,
    Profile: <Ionicons name="person-outline" size={size} color={color} />,
  };
  return icons[route.name] || null;
};

const CalendarStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="CalendarMain"
      component={CalendarMain}
      options={headerOptions('Calendar')}
    />
    <Stack.Screen
      name="DateExpenses"
      component={DateExpenses}
      options={headerOptions('Expense Details')}
    />
    <Stack.Screen
      name="Income"
      component={Income}
      options={headerOptions('Income Details')}
    />
    <Stack.Screen
      name="Expenses"
      component={Expenses}
      options={headerOptions('Expenses Details')}
    />
    <Stack.Screen
      name="Investment"
      component={Investment}
      options={headerOptions('Investment Details')}
    />
  </Stack.Navigator>
);

const headerOptions = (title) => ({
  headerTitle: () => (
    <View style={styles.headerTitleContainer}>
      <Image
        source={require('./assets/logo.png')}
        style={[styles.logo, { width: 130, height: 50 }]} // Increased size
      />
      <View style={styles.fireTextContainer}>
        <Text>
          <Text style={[styles.fireLetter, { fontSize: 18, color: '#FF5733' }]}>F.</Text>
          <Text style={[styles.fireLetter, { fontSize: 18, color: '#FFC300' }]}>I.</Text>
          <Text style={[styles.fireLetter, { fontSize: 18, color: 'brown' }]}>R.</Text>
          <Text style={[styles.fireLetter, { fontSize: 18, color: '#33C3FF' }]}>E.</Text>
          <Text style={styles.numberText}>  </Text>
          <Text style={[styles.fireLetter, { fontSize: 23, color: 'black' }]}>₹95,65,432</Text>
        </Text>
      </View>
    </View>
  ),
  headerTitleAlign: 'center',
  headerStyle: { elevation: 0, borderBottomWidth: 0 },
});

const MainApp = () => {
  const tabAnimationValue = React.useRef(new Animated.Value(0)).current;

  const handleTabChange = (index) => {
    Animated.timing(tabAnimationValue, {
      toValue: index === 0 ? 0 : 10,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Tab.Navigator
      initialRouteName="Calendar"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => getTabBarIcon(route, color, size),
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: [
          styles.tabBar,
          { transform: [{ translateY: tabAnimationValue }] },
        ],
      })}
      screenListeners={{
        state: (e) => handleTabChange(e.data.state.index),
      }}
    >
      <Tab.Screen
        name="Calendar"
        component={CalendarStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="FireNumber"
        component={FireNumber}
        options={headerOptions('Fire Number')}
      />
      <Tab.Screen
        name="Simulator"
        component={Simulator}
        options={headerOptions('Simulator')}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={headerOptions('Profile')}
      />
      <Tab.Screen
        name="Premium"
        component={PremiumSubscription}
        options={headerOptions('Profile')}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreenView}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="SignUp"
          component={RegisterScreenView}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen
          name="MainApp"
          component={MainApp}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#F7FAFC',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 10,
    height: 70,
    paddingBottom: 10,
  },
  headerTitleContainer: {
    flexDirection: 'row', // Align items horizontally
    justifyContent: 'space-between', // Space between logo and fire text
    alignItems: 'center',
    width: '100%', // Ensure full width
    paddingHorizontal: 10, // Adjust padding as necessary
  },
  logo: {
    width: 150, // Increased width
    height: 50, // Increased height
    resizeMode: 'contain',
  },
  fireTextContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align text and number vertically
  },
  fireLetter: {
    fontWeight: 'bold',
    marginHorizontal: 2, // Add spacing between the letters
  },
  normalText: {
    color: '#000',
    fontSize: 16, // Adjust size as needed
  },
  numberText: {
    fontSize: 20, // Increase the number font size
    fontWeight: 'bold',
    color: '#FF5733', // Customize color as needed
    marginLeft: 10, // Space between "FIRE" and the number
  },
});

export default App;
