import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Home, ShoppingCart, User as UserIcon, Settings } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import UpsertProductScreen from './src/screens/UpsertProductScreen';

import { CartProvider } from './src/context/CartContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'HomeTab') return <Home size={size} color={color} />;
          if (route.name === 'Cart') return <ShoppingCart size={size} color={color} />;
          if (route.name === 'Profile') return <UserIcon size={size} color={color} />;
          if (route.name === 'Admin') return <Settings size={size} color={color} />;
          return <Home size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Cart" component={CartScreen} />
      {isAdmin && <Tab.Screen name="Admin" component={AdminDashboardScreen} />}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShadowVisible: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen 
            name="Main" 
            component={TabNavigator} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="ProductDetail" 
            component={ProductDetailScreen} 
            options={{ title: 'Product Details' }}
          />
          <Stack.Screen 
            name="UpsertProduct" 
            component={UpsertProductScreen} 
            options={{ title: 'Manage Product' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <StatusBar style="dark" />
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
