const db = require("../config/mongoDB.js");
const User = require('../models/User.js');
const { GraphQLError } = require('graphql')


class Follow {
    static async addFollow(data) {
        const followCollection = db.collection("Follow");


        const validation = await followCollection.findOne({
            followerId: data.followerId,
            followingId: data.followingId
        })


        if(validation) throw new GraphQLError ("Data already exist")

        const addData = followCollection.insertOne(data)

        return null
    }
}


module.exports = { Follow };