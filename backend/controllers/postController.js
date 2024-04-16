import User from "../models/userModel.js";
import Post from '../models/postModel.js'
import { v2 as cloudinary } from 'cloudinary'

const createPost = async(req, res) => {
    try {
        const {postedBy,text} = req.body;
        let {img} = req.body;
        //console.log({postedBy, text, img});
        if(!postedBy || !text) {
            return res.status(400).json({error: "PostedBy and Text fields are required"})
        }
        const user = await User.findById(postedBy)
        if(!user) {
            return res.status(404).json({error: "User not found"})
        }

        if(user._id.toString() !== req.user._id.toString()) {//If user is trying to post for another profile
            return res.status(401).json({error: "Unauthorised to create post"})
        }

        const maxLength = 500;
        if(text.length>maxLength) {
            res.status(500).json({error: `Text must be less than ${maxLength} chars`})
        }

        if(img) {
            const uploadedResponse = await cloudinary.uploader.upload(img)
            img = uploadedResponse.secure_url
        }

        const newPost = new Post({postedBy,text,img})

        await newPost.save()
        
        res.status(200).json( newPost )
    } catch (error) {
        res.status(500).json({message: error.message})
        console.log(error);
    }
};

const getPost = async(req,res) => {
    try {
        const post = await Post.findById(req.params.id)

        if(!post) {
            return res.status(404).json({error: "Post not found"})
        }

        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const deletePost = async(req,res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post) {
            return res.status(404).json({error: "Post not found"})
        }

        //Check if the user deleting the post is same as 
        //the user who created it(the user currently logged in)
        if(post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({error: "Unauthorised to delete post"})
        }

        if(post.img) {
            const imgId = post.img.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(imgId)
        }

        await Post.findByIdAndDelete(req.params.id)

        res.status(200).json({message: "Post deleted successfully"})

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const likeUnlikePost = async(req,res) => {
    try {
        const {id: postId} = req.params
        const userId = req.user._id

        const post = await Post.findById(postId)

        if(!post) {
            return res.status(404).json({error: "Post not found"})
        }

        const userLikedPost = post.likes.includes(userId)
        if(userLikedPost) {
            //Unlike Post
            await Post.updateOne({_id:postId}, {$pull: {likes: userId}})
            res.status(200).json({message: "Post unliked successfully"})
        } else {
            //Like Post
            post.likes.push(userId)
            await post.save()
            res.status(200).json({message: "Post liked successfully"})
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const replyToPost = async(req,res) => {
    try {
        const { text } = req.body
        const postId = req.params.id
        const userId = req.user._id
        const userProfilePic = req.user.profilePic
        const username = req.user.username

        if(!text) {
            return res.status(400).json({error: "Text field is required"})
        }

        const post = await Post.findById(postId)
        if(!post) {
            return res.status(404).json({error: "Post not found"})
        }

        const reply = {userId, text, userProfilePic, username}

        post.replies.push(reply)
        await post.save()

        res.status(200).json( reply )

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const getFeedPosts = async(req,res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId)
        if(!user) {
            return res.status(404).json({error: "User not found"})
        }

        const following = user.following;

        //sort({createdAt: -1})  To show the lastest posts at the top
        const feedPosts = await Post.find({postedBy: {$in: following}}).sort({createdAt: -1})

        res.status(200).json(feedPosts)

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const getUserPosts = async(req,res) => {
    const { username } = req.params
    try {
        const user = await User.findOne({ username })
        if(!user) return res.status(404).json({error: "User not found"})

        const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 })

        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts };
