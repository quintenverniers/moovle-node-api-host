const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const User = require('../models/user');

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
                        password: hash
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

router.delete('/:userID', (req, res, next) => {
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