import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useMutation, gql } from '@apollo/client';
import tiktoklogo from '../assets/tiktoklogo.png';
import { useNavigation } from '@react-navigation/native'; 


const REGISTER_MUTATION = gql`
mutation Register($username: String!, $email: String!, $password: String!, $name: String) {
  register(username: $username, email: $email, password: $password, name: $name) {
    _id
    name
    username
    email
    password
  }
}
`;

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigationn = useNavigation(); // Get the navigation object



    const [register, { data, loading, error }] = useMutation(REGISTER_MUTATION, {
        onCompleted: (data) => {
            // Navigate to another screen or show success message
            navigationn.navigate('Login'); // Assuming you have a Login screen
        },
        onError: (error) => {
            // Handle registration error
            console.error('Registration error', error);
        },
    });

    const handleRegister = () => {
        register({
            variables: {
                username,
                email,
                password,
                name,
            },
        });
    };

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;

    return (
        <View style={styles.container}>
                    <Image source={tiktoklogo} style={styles.logo} resizeMode="contain" />

            <Text style={styles.title}>Register</Text>

            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerButtonText}>Register</Text>
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
    registerButton: {
        width: '90%',
        backgroundColor: '#007bff', // A nice blue shade for the button
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 20,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    logo: {
        width: 100, // Set the width of the logo
        height: 50, // Set the height of the logo
        marginBottom: 10, // Add some space below the logo
    },
});