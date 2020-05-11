const express = require('express');
const Post = require('../model/post');
const router = express.Router();

router.post("", (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
    });

    post.save().then(createdPost => {
        res.status(201).json({
            message: "Post added successfully",
            postId: createdPost._id
        });
    });
});

router.get("", (req, res, next) => {
    Post.find().then((documents) => {
        res.status(200).json({
            message: "Posts fetched successfully!",
            posts: documents,
        });
    });
});


router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        }
        else {
            res.status(404).json({
                message: 'post not found'
            });
        }

    });
});


router.put("", (req, res, next) => {
    const post = req.body;

    // we still need to send the response as we dont want client be waiting and timeout
    res.status(201).json({
        message: "Put added successfully",
    });
});


router.put("/:id", (req, res, next) => {
    const post = new Post({
        _id: req.body.id,   // added
        title: req.body.title,
        content: req.body.content
    });

    Post.updateOne({ _id: req.params.id }, post).then(updatedPost => {
        res.status(201).json({
            message: 'Post Edited !!',
            postId: updatedPost._id
        });
    });
});

router.delete("/:id", (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then((result) => {
        console.log(result);
        res.status(200).json({ message: "Post deleted!" });
    });
});

router.delete("", (req, res, next) => {
    Post.deleteMany().then((result) => {
        console.log(result);
        res.status(200).json({ message: "All Post deleted!" });
    });
});

module.exports = router;