import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';


const SEARCH_QUERY = gql`
  query SearchNameOrUsername($search: String) {
    searchNameOrUsername(search: $search) {
      _id
      name
      username
      email
    }
  }
`;


export default function SearchNameOrUsernameScreen() {
    const [searchTerm, setSearchTerm] = useState('');
    const navigation = useNavigation();

  
    const { data, loading, error } = useQuery(SEARCH_QUERY, {
      variables: { search: searchTerm },
      skip: searchTerm.length < 1, // Skip the query if search term is too short
    });
  
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or username"
          value={searchTerm}
          onChangeText={setSearchTerm}
          autoCapitalize="none"
        />
        {loading && <Text>Loading...</Text>}
        {error && <Text>Error: {error.message}</Text>}
        <FlatList
                data={data?.searchNameOrUsername}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                    style={styles.resultItem}
                    onPress={() => navigation.navigate('ProfileScreen', { id: item._id })}
                    >
                    <Text style={styles.name}>{item.name} (@{item.username})</Text>
                    <Text style={styles.email}>{item.email}</Text>
    </TouchableOpacity>
  )}
/>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
      paddingHorizontal: 10,
    },
    searchInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      paddingLeft: 10,
      borderRadius: 5,
      marginBottom: 20,
    },
    resultItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#cccccc',
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    email: {
      fontSize: 16,
      color: 'gray',
    },
  });
  