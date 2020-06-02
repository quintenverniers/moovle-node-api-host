const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    User.find({ email: req.body.email}).exec()
    .then(users => {
        console.log("yeh");
        if(users.length < 1) {
            return res.status(401).json({
                message: 'Auth failed'
            })
        }
        bcrypt.compare(req.body.password, users[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }

            if(result) {
                return res.status(200).json({
                    message: 'Auth successful'
                })
            }
        })
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