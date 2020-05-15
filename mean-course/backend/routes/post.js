const express = require('express');
const multer = require("multer");
const Post = require('../model/post');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');


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

router.post("", checkAuth, multer({ storage: storage }).single("image"),
    (req, res, next) => {
        const url = req.protocol + "://" + req.get("host");
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            imagePath: url + "/images/" + req.file.filename,
            creator: req.userData.userId
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


router.put("", checkAuth, (req, res, next) => {
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

router.put("/:id", checkAuth, multer({ storage: storage }).single("image"),
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
            imagePath: imagePath,
            creator: req.userData.userId
        });
        // Post.updateOne({ _id: req.params.id }, post).then(result => {
        Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
            console.log(result)
            if (result.nModified > 0) {
                res.status(200).json({ message: "Update successful!" });
            } else {
                res.status(401).json({ message: "Not authorized!" });
            }
        });

    }
);

router.delete("/:id", checkAuth, (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
        result => {
            console.log(result);
            if (result.n > 0) {
                res.status(200).json({ message: "Deletion successful!" });
            } else {
                res.status(401).json({ message: "Not authorized!" });
            }
        }
    )
});

router.delete("", checkAuth, (req, res, next) => {
    Post.deleteMany({ creator: req.userData.userId }).then((result) => {
        console.log(result);
        if (result.n > 0) {
            res.status(200).json({ message: "Delete All successful!" });
        } else {
            res.status(401).json({ message: "Not authorized!" });
        }
    });
});

module.exports = router;