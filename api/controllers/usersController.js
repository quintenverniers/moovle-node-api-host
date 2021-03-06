const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const User = require('../models/user');

/**
 * Get all users
 */
exports.get_all_users = (req, res, next) => {
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
};

/**
 * Get a user
 */
exports.get_user_by_id = (req, res, next) => {
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
};

/**
 * Create a user
 */
exports.register_user = (req, res, next) => {
    let date = new Date();
    date.setUTCHours(0,0,0,0);
    createdDate = Date.parse(date.toISOString());
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
                        dateOfBirth: req.body.birthday,
                        createdAt: createdDate
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
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    })

};

/**
 * Login a user
 */
exports.user_login = (req, res, next) => {
    let JWT_KEY = "icSSmYBncvosHIeqsbnObyl2Y5SCfveupdcA4Oz2xAMIYT8cjHesNqNXkwqDkDB"
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
                    JWT_KEY, 
                    {
                        expiresIn: "7d"
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
};

/**
 * Delete a user
 */
exports.delete_user = (req, res, next) => {
    User.deleteOne({_id: req.params.userID}).exec()
    .then(result => {
        res.status(200).json({
            message: 'user deleted',
            newAuthToken: req.userData.newToken
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

/**
 * Update a user
 */
exports.update_user = (req, res, next) => {
    const id = req.userData.userID;
    const fieldsToUpdate = {};
    for(const field of req.body) {
        fieldsToUpdate[field.propName] = field.value
    }

    User.update({ _id: id },{ $set: fieldsToUpdate })
    .exec()
    .then((result) => {
        res.status(200).json({ 
            result,
            newAuthToken: req.userData.newToken
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};