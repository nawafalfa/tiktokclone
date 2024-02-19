import { Text, TouchableOpacity, StyleSheet, View } from "react-native"
import * as SecureStore from 'expo-secure-store'
import { useNavigation } from "@react-navigation/native"
import { useContext } from "react"
import AuthContext from "../context/auth"
import LoginScreen from "../screens/Login"
import Logo from 'react-native-vector-icons/MaterialIcons'

export default function LogoutButton(){
    const navigation = useNavigation();
    const authContext = useContext(AuthContext)


    return (
        <TouchableOpacity 
            onPress={() => {
                SecureStore.deleteItemAsync('accessToken');
                authContext.setIsSignedIn(false);
            }}
        >
            <View style={styles.iconContainer}>
                <Logo size={28} name="logout" style={styles.icon} />
                <Text style={styles.text}>Logout</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#FF4757', 
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    text: {
        fontSize: 9, // Adjust fontSize as needed, remove quotes around fontSize value
        color: '#000', // Example text color, adjust as needed
        // Add any additional text styling here
      },
      iconContainer: {
        alignItems: 'center', // Center the icon and text horizontally
      },
});