import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import Logo from 'react-native-vector-icons/EvilIcons'

const PostCard = ({ post }) => {
  const navigation = useNavigation(); // Use the useNavigation hook

  return (
    <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { getPostByIdId: post._id })}>
      <View style={styles.cardContainer}>
        <View style={styles.cardContent}>
          {post.imgUrl && <Image source={{ uri: post.imgUrl }} style={styles.cardImage} />}
          <Text style={styles.cardTitle}>{post.authorDetail.name}</Text>
          <Text style={styles.cardText}>{post.content}</Text>
          <Text style={styles.tagsText}>Tags: {post.tags.join(', ')}</Text>
          
          {/* Icons and Text side by side */}
          <View style={styles.iconsRow}>
            <TouchableOpacity style={styles.iconWithText} onPress={() => {/* Like functionality */}}>
              <Logo name="heart" size={24} style={styles.icon} />
              <Text>{post.likes.length}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.iconWithText} onPress={() => {/* Comment functionality */}}>
              <Logo name="comment" size={24} style={styles.icon} />
              {/* <Text>{post.comment.length}</Text> */}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  cardContent: {
    padding: 20,
  },
  cardImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
  },
  tagsText: {
    fontSize: 14,
    marginBottom: 10,
  },
  iconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Adjust spacing as needed
    alignItems: 'center',
    marginTop: 10,
  },
  iconWithText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  // Add other styles as needed
});

export default PostCard;
