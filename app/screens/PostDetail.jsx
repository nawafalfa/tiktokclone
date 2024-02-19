import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_POST_BY_ID_QUERY = gql`
  query GetPostById($getPostByIdId: ID) {
    getPostById(id: $getPostByIdId) {
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

const COMMENT_POST_MUTATION = gql`
  mutation CommentPost($content: String!, $commentPostId: ID!) {
    CommentPost(content: $content, id: $commentPostId) {
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

const LIKE_POST_MUTATION = gql`
  mutation LikePost($likePostId: ID!) {
    LikePost(id: $likePostId) {
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



export default function PostDetailScreen({ route }) {
    const { getPostByIdId } = route.params;
    const { data, loading, error } = useQuery(GET_POST_BY_ID_QUERY, {
      variables: { getPostByIdId },
    });
    const [commentContent, setCommentContent] = useState('');
    
    const [likePost, { data: likeData, loading: likeLoading, error: likeError }] = useMutation(LIKE_POST_MUTATION, {
        variables: { likePostId: getPostByIdId }, 
        onCompleted: () => {
        },
        refetchQueries: [
          { query: GET_POST_BY_ID_QUERY, variables: { getPostByIdId: getPostByIdId } }, 
        ],
        onError: (error) => {
          console.error('Error liking post:', error);
        },
      });

    const [commentPost] = useMutation(COMMENT_POST_MUTATION, {
      variables: {
        content: commentContent,
        commentPostId: getPostByIdId,
      },
      refetchQueries: [
        { query: GET_POST_BY_ID_QUERY, variables: { getPostByIdId } }, 
      ],
    });
  
    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;
  
    const post = data.getPostById;
    console.log(getPostByIdId);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{post.content}</Text>
      {console.log(post.imgUrl)}
      {post.imgUrl && <Image source={{ uri: post.imgUrl }} style={styles.image} />}
      <Text style={styles.sectionTitle}>Tags:</Text>
      <Text>{post.tags.join(', ')}</Text>
      <Text style={styles.sectionTitle}>Author:</Text>
      <Text>{post.authorDetail.name}</Text>
      <TouchableOpacity
        style={styles.likeButton}
        onPress={() => likePost({ variables: { likePostId: getPostByIdId } })}
        disabled={likeLoading}
        >
        <Text style={styles.likeButtonText}>{likeLoading ? 'Liking...' : 'Like Post'}</Text>
        </TouchableOpacity>
      <View style={styles.commentSection}>
        <TextInput
          style={styles.commentInput}
          placeholder="Write a comment..."
          value={commentContent}
          onChangeText={setCommentContent}
          multiline
        />
        <TouchableOpacity
          style={styles.commentButton}
          onPress={() => {
            commentPost();
            setCommentContent(''); 
          }}
        >
          <Text style={styles.commentButtonText}>Post Comment</Text>
        </TouchableOpacity>
      </View>
      {/* Comments List */}
      {post.comment && post.comment.length > 0 ? (
  post.comment.map((comment, index) => (
    <View key={index} style={styles.comment}>
      <Text style={styles.commentUsername}>{comment.username}:</Text>
      <Text style={styles.commentContent}>{comment.content}</Text>
    </View>
  ))
) : (
  <Text>No comments yet</Text>
)}
    </ScrollView>
  );
}
  
const styles = StyleSheet.create({
    commentSection: {
      marginTop: 20,
    },
    commentInput: {
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      backgroundColor: '#fff',
    },
    commentButton: {
      backgroundColor: '#007bff',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    commentButtonText: {
      color: '#ffffff',
      fontSize: 16,
    },
    comment: {
      marginTop: 10,
    },
    commentUsername: {
      fontWeight: 'bold',
    },
    commentContent: {
      marginLeft: 5,
    },
    likeButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
      },
      likeButtonText: {
        color: '#ffffff',
        fontSize: 16,
      },
  });
