const express = require('express');
const multer = require("multer");
const Post = require('../model/post');
const router = express.Router();
const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname
            .toLowerCase()
            .split(" ")
            .join("-");
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + "-" + Date.now() + "." + ext);
    }
});

router.post(
    "",
    multer({ storage: storage }).single("image"),
    (req, res, next) => {
        const url = req.protocol + "://" + req.get("host");
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            imagePath: url + "/images/" + req.file.filename
        });
        post.save().then(createdPost => {
            res.status(201).json({
                message: "Post added successfully",
                post: {
                    ...createdPost,
                    id: createdPost._id
                }
            });
        });
    }
);


router.get("", (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    let fetchedPosts;
    const postQuery = Post.find();

    // if inputs are valid
    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    postQuery
        .find()
        .then((documents) => {
            fetchedPosts = documents;
            return Post.count();
        })
        .then((count) => {
            res.status(200).json({
                message: "Posts fetched successfully!",
                posts: fetchedPosts,
                maxPosts: count
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


// router.put("/:id", (req, res, next) => {
//     const post = new Post({
//         _id: req.body.id,   // added
//         title: req.body.title,
//         content: req.body.content
//     });

//     Post.updateOne({ _id: req.params.id }, post).then(updatedPost => {
//         res.status(201).json({
//             message: 'Post Edited !!',
//             postId: updatedPost._id
//         });
//     });
// });

router.put("/:id", multer({ storage: storage }).single("image"),
    (req, res, next) => {
        let imagePath = req.body.imagePath;
        if (req.file) {
            const url = req.protocol + "://" + req.get("host");
            imagePath = url + "/images/" + req.file.filename
        }
        const post = new Post({
            _id: req.body.id,
            title: req.body.title,
            content: req.body.content,
            imagePath: imagePath
        });
        // console.log(post);
        Post.updateOne({ _id: req.params.id }, post).then(result => {
            res.status(200).json({ message: "Update successful!" });
        });
    }
);

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