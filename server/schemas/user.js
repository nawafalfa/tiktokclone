const { GraphQLError } = require("graphql")
const { User } = require('../models/User.js');
const { Long } = require("mongodb");

const users = [
    {
        id : "1",
        name : "Nawaf",
        username : "nawafroggo",
        email : "nawaf.roggo@gmail.com",
        password : "chainkiller"
    },
    {
        id : "2",
        name : "Nawaf2",
        username : "nawafalfa",
        email : "nawaf.roggo1@gmail.com",
        password : "chainkiller1"
    }
]

const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type User {
    _id: ID
    name: String
    username: String!
    email: String!
    password: String!
  }

  type UserFollowers {
    _id: ID
    name: String
    username: String!
    email: String!
    password: String!
    userFollowers: [User]
    userFollowings: [User]
  }

  type Token {
  access_token: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    getUserByUsernameAndPassword: User
    getAllUsers: [User]
    searchNameOrUsername(search: String): [User]
    getUserById(_id: ID!): UserFollowers
  }

  type Mutation { 
    register(
    name: String,
    username: String!,
    email: String!,
    password: String!,): User
    login(
    username: String!,
    password: String!,
    ): Token
  }
`;
/// ini untuk typdef lalu buat untuk resolver

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
      getUserByUsernameAndPassword: (_, args, contextValue) => {
        return users.find((user) => user.username)
        },
      getAllUsers: (_, args, contextValue) => User.getAllUser(),
      searchNameOrUsername: async (_, args, contextValue) => {

        await contextValue.authentication()

        const { search } = args

        const data = await User.getUserByNameOrUsername(search)

        return data

      },
      getUserById : async (_, args, contextValue) => {

        await contextValue.authentication()

        const { _id } = args

        const result = await User.getUserById(_id)

        return result
        
      }

    },

    Mutation: {
        register: async (_, args, contextValue) => {
            const { name, username, email, password } = args

            const register = {
                name,
                username,
                email,
                password
            }

            const newUser = await User.register(register)

            return newUser.createdData
        },
        login: async (_, args, contextValue) => {
            const {username, password} = args

            const access_token = await User.login(username, password)
            return {
                access_token : access_token
            }
        }
    }
  };

  module.exports = {
    typeDefs,
    resolvers
  };