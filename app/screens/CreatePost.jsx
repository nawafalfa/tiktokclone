import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView } from 'react-native';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';


const ADD_POST_MUTATION = gql`
  mutation AddPost($content: String!, $tags: [String], $imgUrl: String) {
    AddPost(content: $content, tags: $tags, imgUrl: $imgUrl) {
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
    }
  }
`;

export default function CreatePost({ navigation }) {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const [addPost, { data, loading, error }] = useMutation(ADD_POST_MUTATION);

  const handleSubmit = async () => {
    const tagsArray = tags.split(',').map(tag => tag.trim()); // Convert comma-separated string to array
    try {
      await addPost({
        variables: {
          content,
          tags: tagsArray,
          imgUrl,
        },
      });
      // Navigate back or to another screen upon success
      navigation.navigate('Home'); // or navigation.navigate('Home');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="content"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="tags"
        value={tags}
        onChangeText={setTags}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={imgUrl}
        onChangeText={setImgUrl}
      />
      {error && <Text style={styles.errorText}>Error submitting post: {error.message}</Text>}
      <Button title="Submit Post" onPress={handleSubmit} disabled={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  // Add more styles as needed
});
