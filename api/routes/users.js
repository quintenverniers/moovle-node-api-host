const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const checkAuth = require('../middleware/verifyAuthenticationToken.js');

const User = require('../models/user');

router.get("/", (req, res, next) => {
    User.find()
    .exec()
    .then((users) => {
        res.status(200).json({
            count: users.length,
            users: users
        });
    })
    .catch(err => {
        res.status(500).json({
            message: err
        });
    })
})

router.get("/:UserID", (req, res, next) => {
    const id = req.params.UserID;
    User.findById(id)
    .exec()
    .then((user) => {
        if(user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({
                message: 'no user found with the provided ID'
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            message: err
        });
    })
})

router.post("/signup", (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length >= 1) {
            return res.status(422).json({
                message: 'An account already exists with this email address'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error: err,
                        message: 'Something went wrong.'
                    });
                } else {
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        country: req.body.country,
                        dateOfBirth: req.body.birthday
                    });
                    user.save()
                    .then(createdUser => {
                        res.status(201).json({
                            message: 'User was successfully created',
                            user: createdUser
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    });
                }
            });
        }
    })
});

router.post("/login", (req, res, next) => {
    User.find({ email: req.body.email }).exec()
    .then(users => {
        if(users.length < 1) {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        bcrypt.compare(req.body.password, users[0].password, function(err, result) {
            if(err) {
                return res.status(401).json({
                    message: 'Auth faileeed'
                });
            }
            if(result) {    
                const Token = JWT.sign(
                    {
                        email: users[0].email,
                        userID: users[0]._id
                    }, 
                    process.env.JWT_KEY, 
                    {
                        expiresIn: "2h"
                    }
                    );       
                    return res.status(200).json({
                        message: 'Auth successful',
                        user: {
                            id: users[0]._id,
                            firstname: users[0].firstname,
                            lastname: users[0].lastname,
                            email: users[0].email,
                        },
                        token: Token
                    }
                );
            } else {
                return res.status(401).json({
                    message: 'Auth faileeed'
                });
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
})

router.delete('/:userID', checkAuth, (req, res, next) => {
    User.deleteOne({_id: req.params.userID}).exec()
    .then(result => {
        res.status(200).json({
            message: 'user deleted'
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;