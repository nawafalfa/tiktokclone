import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import Logo from 'react-native-vector-icons/EvilIcons'

const FOLLOW_USER_MUTATION = gql`
  mutation FollowUser($followingId: ID!) {
    FollowUser(followingId: $followingId) {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
`;

const GET_USER_BY_ID_QUERY = gql`
  query Query($id: ID!) {
    getUserById(_id: $id) {
      _id
      name
      username
      email
      userFollowers {
        _id
        name
        username
        email
      }
      userFollowings {
        _id
        name
        username
        email
      }
    }
  }
`;

export default function ProfileScreen({ route }) {
  const { id } = route.params;
  const { data, loading, error, refetch } = useQuery(GET_USER_BY_ID_QUERY, {
    variables: { id },
  });
  const [followed, setFollowed] = useState(false);

  const [followUser] = useMutation(FOLLOW_USER_MUTATION, {
    onCompleted: () => {
      setFollowed(true); 
    },
  });

  useEffect(() => {
    if (followed) {
      refetch();
      setFollowed(false); // Reset followed state if you want to allow re-following
    }
  }, [followed, refetch]);

  const handleFollow = () => {
    followUser({ variables: { followingId: id } });
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const user = data?.getUserById;
  return (
    <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.imageContainter}>
            <Logo size={200} name='user'></Logo>
            </View> 
      <Text style={styles.title}>{user?.name}</Text>
      <Text style={styles.username}>@{user?.username}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Followers:</Text>
        {user?.userFollowers.map((follower, index) => (
          <Text key={index} style={styles.detailText}>
            {follower.name} (@{follower.username})
          </Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Following:</Text>
        {user?.userFollowings.map((following, index) => (
          <Text key={index} style={styles.detailText}>
            {following.name} (@{following.username})
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  imageContainter: {
    paddingBottom : 20,
    alignItems: 'center'
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60, // Make it round
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  username: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginLeft: 10,
  },
  followButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  followButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});