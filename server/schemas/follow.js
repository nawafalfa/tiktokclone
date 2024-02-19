const { Follow } = require('../models/Follow')
const ObjectId = require('mongodb').ObjectId

const typeDefs = `#graphql
 type Follow {
 _id: ID
 followingId: ID
 followerId: ID
 createdAt: String
 updatedAt: String

 }

 type Mutation {
    FollowUser(followingId: ID): Follow
 }

`

const resolvers = {
    Mutation: {
        FollowUser: async (_, args, contextValue) => {
            
            const user = contextValue.authentication();

            const followerId = new ObjectId(user.id)
            const followingId = new ObjectId(args.followingId)
         
            let data = {
                followerId: followerId,
                followingId: followingId,
                createdAt: new Date(),
                updatedAt: new Date()
            }


    
            let result = await Follow.addFollow(data)

            console.log(result);
        
            return data
        }
      }
}

module.exports = {
    typeDefs,
    resolvers
}