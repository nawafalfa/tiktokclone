if ( process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { typeDefs : userTypeDefs, resolvers : userResolvers} = require('./schemas/user.js') 
const { typeDefs : postTypeDefs, resolvers : postResolvers } = require("./schemas/posts.js")
const { typeDefs : followTypeDefs, resolvers : followResolvers} = require("./schemas/follow.js")
const { verifyToken, signToken } = require('./helpers/jwt.js')

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type User {
    _id: ID!
    name: String
    username: String
    email: String
    password: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  #type Query {
   # books: [Book]
  #}

  #type Mutation {
   # register : []
  #}
`;

const resolvers = {
    Query: {
      books: () => books,
    },
  };

  // The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.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
const server = new ApolloServer({
    typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
    resolvers: [userResolvers, postResolvers, followResolvers],
    introspection: true
  });
  
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
//   const { url } = await startStandaloneServer(server, {
//     listen: { port: 4000 },
//   });
  
  
  startStandaloneServer(server, {
      listen: { port :  process.env.PORT || 3000},
      context: async ({req, res}) => {
        return {
          authentication: () => {
              const token = req.headers.authorization.split(" ")[1]
              // console.log(token);
              const payload = verifyToken(token)
              // console.log(payload);
              if (!payload) {
                throw new Error("Unauthorized access")
              }
              return payload
          }
        }
      }
    }).then(({url}) => {
        console.log(`🚀  Server ready at: ${url}`)})