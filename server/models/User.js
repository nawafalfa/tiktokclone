const { Long } = require('mongodb')
const db = require('../config/mongoDB.js')
const { hashPass, comparePass } = require('../helpers/bcrypt.js')
const { signToken, verifyToken } = require('../helpers/jwt.js')
const { GraphQLError } = require('graphql')
const ObjectId = require('mongodb').ObjectId

class User {

    static async getAllUser() {
        const getAllUsers = db.collection('User')
        const users = await getAllUsers.find().toArray()
        return users
    }

    static async register(user) {

        if (user.password.length < 5) {
            throw new GraphQLError("password must be at least 5 characters", {
                extensions: { code : 'BAD REQUEST'}
            })
        }

        const emailRegex = /^\S+@\S+\.\S+$/;

        if (!emailRegex.test(user.email)) {
            throw new GraphQLError("Invalid email format", {
                extensions: { code: 'BAD REQUEST' }
            });
        }

        const register = db.collection('User')
        
        const cekUnique = await register.findOne({
            $or : [{username : user.username}, {email : user.email}]
        })

        if (cekUnique) throw new GraphQLError("Username atau Email telah digunakan")

        const newUser = await register.insertOne({...user, password : hashPass(user.password)})
        
        const createdData = await register.findOne({
            _id : new ObjectId(newUser.insertedId)
        })

        return {
            createdData
        }
    }

    static async login(username, password) {

        const loginUser = await db.collection('User').findOne({
            username : username
        })

        if (!loginUser) {
            throw new GraphQLError ( message = "Username tidak terdaftar")
        }

        const compared = comparePass(password, loginUser.password)
        if (!compared) throw new GraphQLError ( message = "Invalid password")

        const access_token = signToken({id : loginUser._id, username : loginUser.username})

        return access_token
}   

    static async getUserByNameOrUsername(search) {

        const userCollection = db.collection('User')

        const result = await userCollection.find({
            $or : [{ username : {$regex: search}}, {name : {$regex: search}}]
        }).toArray()

        // console.log(result);
        return result
    }

    static async getUserById(id) {

        const objectId = new ObjectId(id);

        const findUserById = await db.collection('User').aggregate(
            [
                {
                  $match:
                
                    {
                      _id: {
                        $eq: objectId
                      },
                    },
                },
                {
                  $lookup:
                  
                    {
                      from: "Follow",
                      localField: "_id",
                      foreignField: "followingId",
                      as: "followers",
                    },
                },
                {
                  $lookup: {
                      from: "User",
                      localField: "followers.followerId",
                      foreignField: "_id",
                      as: "userFollowers",
                      pipeline: [
                          {
                              $project: {
                                  password: 0 
                              }
                          }
                      ]
                  },
              },
                {
                  $lookup:
                    /**
                     * from: The target collection.
                     * localField: The local join field.
                     * foreignField: The target join field.
                     * as: The name for the results.
                     * pipeline: Optional pipeline to run on the foreign collection.
                     * let: Optional variables to use in the pipeline field stages.
                     */
                    {
                      from: "Follow",
                      localField: "_id",
                      foreignField: "followerId",
                      as: "followings",
                    },
                },
                {
                  $lookup: {
                      from: "User",
                      localField: "followings.followingId",
                      foreignField: "_id",
                      as: "userFollowings",
                      pipeline: [
                          {
                              $project: {
                                  password: 0 
                              }
                          }
                      ]
                  },
              },
                    {
                        $project: {
                            "password": 0, 
                        }
                    }
              
    ]).toArray()

        console.log(findUserById);

        if (!findUserById) throw new GraphQLError ( message = "Not found")

        return findUserById[0]

    }

}

module.exports = { User }