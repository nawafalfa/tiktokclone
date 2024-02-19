const { GraphQLError } = require("graphql")
const { Post } = require('../models/Posts.js');
const { Long } = require("mongodb");
const { redis } = require('../config/redisConnection.js')



// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Post {
    _id: ID
    content: String!
    tags: [String]
    imgUrl: String
    authorId: ID!
    comment: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
  }

  type PostById {
    _id: ID
    content: String!
    tags: [String]
    imgUrl: String
    authorId: ID!
    comment: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
    authorDetail: [User]
  }

  type Comment {
    content: String!
    username: String!
    createdAt: String
    updatedAt: String
  }

  type Like {
    username: String!
    createdAt: String
    updatedAt: String
  }

  type Query {
    getPosts: [PostById]
    getPostById(id: ID): PostById
  }

  type Mutation {
    AddPost(content: String!, tags: [String], imgUrl: String): Post
    CommentPost(content: String!, id: String!): Post
    LikePost(id: String!): Post
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  
`;

const resolvers = {
    Query: {
      getPosts : async (_, args, contextValue) => {

      contextValue.authentication()
      
      // await redis.del("Post")

      const redisPost = await redis.get("Post")

      if ( redisPost ) {
        
        const parsedData = JSON.parse(redisPost)
        
        return parsedData

      }
      const posts = await Post.getAllPosts() 
      
      await redis.set("Post", JSON.stringify(posts))
      
      return posts
      
    },
      getPostById : async (_, args, contextValue) => {
        contextValue.authentication()

        return await Post.getPostById(args.id)
      }
    },

    Mutation : {
        AddPost : async (_, args, contextValue) => {

            const payload = contextValue.authentication();

            const {content, tags, imgUrl} = args

            const post = await Post.addPost(content, tags, imgUrl, payload)
            
            await redis.del("Post")
            return post
        },
        CommentPost : async (_, args, contextValue) => {
            const payload = contextValue.authentication();

            const {content, id} = args

            const post = await Post.commentPost(id, payload.username, content)

            

            return post
        },
        LikePost : async (_, args, contextValue) => {
          const payload = contextValue.authentication()

          const { id } = args

          const post = await Post.likePost(id, payload.username)

          return post
        }
    }
}

module.exports = { typeDefs, resolvers }