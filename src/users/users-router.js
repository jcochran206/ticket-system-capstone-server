const path = require('path')
const express = require('express')
const xss = require('xss')
const userService = require('./users-service')

const userRouter = express.Router();
const jsonParser = express.json();

const serializeUsers = user => ({
    id: user.id,
    username: xss(user.username),
    pwd: user.pwd,
    email: user.email,
})

userRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        userService.getUsers(knexInstance)
            .then(users => {
                res.json(users.map(serializeUsers))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {username, pwd, email} = req.body;
        console.log('username:', username, "password:", pwd, "email:", email)
    })
//getUserbyId
userRouter
    .route('/:userid')
    .all((req, res, next) => {
        const { userid } = req.params;
        userService.getUsersById(req.app.get('db'), userid)
            .then(userid => {
                if (!userid) {
                    return res
                        .status(404)
                        .send({ error: { message: `User doesn't exist.` } })
                }
                res.userid = userid
                next()
            })
            .catch(next)
    })
    .get((req, res) => {
        res.json(serializeUsers(res.userid))
    })
    
   
















module.exports = userRouter