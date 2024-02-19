const db = require('../config/mongoDB.js')
const { GraphQLError } = require('graphql')
const ObjectId = require('mongodb').ObjectId

class Post {

    static async addPost(content, tags, imgUrl, payload) {
        
        const post = await db.collection('Post').insertOne({
            content : content,
            tags : tags,
            imgUrl : imgUrl,
            authorId : new ObjectId(payload.id),
            comments : [],
            likes : [],
            createdAt : new Date(),
            updatedAt : new Date()
        })
        
        const id = new ObjectId(post.insertedId)

        const returnPost = await db.collection('Post').findOne({
            _id : id
        })

        return returnPost

    }

    static async getAllPosts() {

        const data = await db.collection('Post').aggregate([
            {
                $lookup:
                {
                    from: "User",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "authorDetail",
                    pipeline: [
                        {
                            $project: {
                                password: 0 
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    "authorName": "$authorDetails.name" 
                }
            }
        ]).sort({ createdAt: -1 }).toArray();

        // console.log(data);
        return data
    }

    static async getPostById(id) {

        const findId = new ObjectId(id)

        // console.log(findId);

        const data = await db.collection('Post').aggregate(
            [
                {
                    $match:
                    {
                        _id: {
                            $eq: findId
                        },
                    },
                },
                {
                    $lookup:
                    {
                        from: "User",
                        localField: "authorId",
                        foreignField: "_id",
                        as: "authorDetail",
                        pipeline: [
                            {
                                $project: {
                                    password: 0 
                                }
                            }
                        ]
                    }
                },
                {
                    $addFields: {
                        "authorName": "$authorDetails.name" 
                    }
                }
            ]
        ).toArray()

        // console.log(data);

        return data[0]

    }

    static async commentPost(postId, username, content) {

        const post = await db.collection('Post').findOne({ _id: new ObjectId(postId) });

        if (!post) throw new Error('Post not found');

        const updatedPost = await db.collection('Post').findOneAndUpdate(
            { _id: new ObjectId(postId) },
            { $push: { comments: { content, username, createdAt: new Date(), updatedAt: new Date() } } },
            { returnDocument: 'after' }
        );

        return updatedPost

    }

    static async likePost(id, username) {

        const post = await db.collection('Post').findOne({_id: new ObjectId(id)});

        const hasLiked = post.likes.some(like => like.username === username);

        if (hasLiked) {
            throw new GraphQLError("You have already liked this Post");
        }

        const updatedpost = await db.collection('Post').findOneAndUpdate(
            {_id: new ObjectId(id)},
            { $push: { likes: {username, createdAt : new Date(), updatedAt: new Date()}
            }},
            { returnDocument: 'after'})
        
            
            return updatedpost
    }


}

module.exports = { Post }