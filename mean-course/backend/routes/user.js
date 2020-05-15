const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../model/user');
const jwt = require('jsonwebtoken');


router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });

            user.save()
                .then(resp => {
                    res.status(201).json({
                        message: 'User Created',
                        result: resp
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                });
        })
});


router.post("/login", (req, res, next) => {
    let fetchedUser;
    //Validate the incoming credentials with DB
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "Authentication Failed!!!"
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password)
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "Authentication Failed!!!"
                });
            }

            const token = jwt.sign({
                email: fetchedUser.email,
                userId: fetchedUser._id
            },
                'test_secret_key',
                {
                    expiresIn: '1h'
                }
            );

            res.status(200).json({
                token: token,
                expiresIn: 3600
            });

        })
        .catch(err => {
            return res.status(401).json({
                message: "Authentication Failed!!!"
            });
        });
});


module.exports = router;
