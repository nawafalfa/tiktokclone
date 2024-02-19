import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { gql, useMutation } from '@apollo/client';
import * as SecureStore from 'expo-secure-store'
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthContext from '../context/auth';
import Logo from 'react-native-vector-icons/MaterialIcons'
import tiktoklogo from '../assets/tiktoklogo.png'
import { Image } from 'react-native';



const LOGIN =  gql`
mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      access_token
    }
  }
`

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const authContext = useContext(AuthContext)
    const navigation = useNavigation(); // Get the navigation object
    
    
    const [loginFunction, { data, loading, error }] = useMutation(LOGIN, {
        onCompleted: async (result) => {
            console.log(result);
            await SecureStore.setItemAsync('accessToken', result.login.access_token)
            authContext.setIsSignedIn(true)
        }
    });
    if (loading) return <Text>'Submitting...'</Text>
    if (error) return <Text>Submission error! {JSON.stringify(error)}</Text>
    
    const handleGoToRegister = () => {
        navigation.navigate('Register'); 
    };

    return (
        <View style={styles.container}>
 
        <Image source={tiktoklogo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Log In</Text>
     
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity
                style={styles.loginButton}
                onPress={() => {
                    loginFunction({
                        variables: {
                            username,
                            password,
                        },
                    });
                }}
            >
                <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleGoToRegister}>
                <Text style={styles.registerText}>Don't have an account? Register here</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5', // A light background color
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333', // Dark text for better contrast
    },
    input: {
        width: '90%',
        backgroundColor: '#fff', // White background for the input
        borderColor: '#ddd', // Light border color
        borderWidth: 1,
        borderRadius: 25, // Rounded corners
        padding: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    loginButton: {
        width: '90%',
        backgroundColor: '#007bff', // A nice blue shade for the button
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 20,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerText: {
        color: '#007bff', // Use the same blue shade for a cohesive look
        fontSize: 16,
    },
    logo: {
        width: 100, // Set the width of the logo
        height: 50, // Set the height of the logo
        marginBottom: 10, // Add some space below the logo
    },
});