import React, { useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import PostCard from '../components/Card';
import LogoutButton from '../components/LogoutButton';
import Navbar from '../components/Navbar';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window');


const GET_POSTS = gql`
  query Query {
    getPosts {
      _id
      content
      tags
      imgUrl
      authorId
      comment {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      authorDetail {
        _id
        name
        username
        email
      }
    }
  }
`;

export default function HomeScreen() {
  const { loading, error, data, refetch } = useQuery(GET_POSTS);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = refetch(); // Refetch posts when the screen is focused

      return () => unsubscribe; // Return unsubscribe function to clean up
    }, [refetch])
  );

  if (loading) return <Text>Loading posts...</Text>;
  if (error) return <Text>Error loading posts: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={data.getPosts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{ height }}>
            <PostCard post={item} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        decelerationRate="fast"
        snapToAlignment="start"
      />
      <Navbar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
    postContainer: {
      backgroundColor: '#ffffff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4, // Necessary for Android
    },
    postContent: {
      fontSize: 16,
      marginBottom: 10,
    },
    postImage: {
      width: '100%',
      height: 200,
      borderRadius: 10,
      marginBottom: 10,
    },
    card: {
        marginVertical: 8,
        marginHorizontal: 16,
      },
      postContent: {
        marginBottom: 10,
      },
      postImage: {
        borderRadius: 10, // Note: React Native Paper might not apply this style directly to Card.Cover
      },
      list: {
        marginTop: 10,
      },
      container: {
        flex: 1,
      },
      loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
    // Add more styles as needed
  });
  
