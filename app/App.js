import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import client from './config/apolloClient'
import { useEffect, useState } from 'react';
import AuthContext from './context/auth';
import * as SecureStore from 'expo-secure-store'
import LoginScreen from './screens/Login';
import CreatePost from './screens/CreatePost';
import HomeScreen from './screens/Home';
import RegisterScreen from './screens/Register';
import ProfileScreen from './screens/Profile';
import PostDetailScreen from './screens/PostDetail';
import SearchNameOrUsernameScreen from './screens/Search';


const Stack = createNativeStackNavigator();

export default function App() {

  const [isSignedIn, setIsSignedIn] = useState(null);

  useEffect(() => {
    SecureStore.getItemAsync('accessToken')
    .then(token => {
      if (token) {
        setIsSignedIn(true)
      }
    })
  }, [])

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>
        <NavigationContainer>
          <Stack.Navigator>
            {
              isSignedIn ? (
                // Screens to show when signed in
                <>
                  <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'TikTok / Douhyin' }} />
                  <Stack.Screen name="CreatePost" component={CreatePost} options={{ title: 'Add Post' }} />
                  <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: 'Profile' }} />
                  <Stack.Screen name="PostDetail" component={PostDetailScreen} />
                  <Stack.Screen name="SearchNameOrUsername" component={SearchNameOrUsernameScreen} options={{ title: 'Search' }} />
                </>
              ) : (
                // Screens to show when not signed in
                <>
                <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
                </>
              )
            }
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
