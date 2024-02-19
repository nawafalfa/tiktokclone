import logo from "react-native-vector-icons/EvilIcons"
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LogoutButton from './LogoutButton';
import Logo from 'react-native-vector-icons/MaterialIcons'

const Navbar = ({ navigation }) => {

  return (
    <View style={styles.navbar}>
    <View style={styles.iconContainer}> 
      <TouchableOpacity onPress={() => navigation.navigate('SearchNameOrUsername')}>
        <Logo size={32} name='search'></Logo>
        <Text style={styles.text}>   Search</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('CreatePost')}>
          <Logo size={32} name='add'></Logo>
          <Text style={styles.text}> Add Post</Text>
        </TouchableOpacity>
    </View> 
      <LogoutButton />
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#eee',
  },
  navItem: {
    fontSize: 18,
  },
  iconContainer: {
    alignItems: 'center', // Center the icon and text horizontally
  },
  text: {
    fontSize: 9, // Adjust fontSize as needed, remove quotes around fontSize value
    color: '#000', // Example text color, adjust as needed
    // Add any additional text styling here
  }
  // Add more styles as needed
});

export default Navbar;