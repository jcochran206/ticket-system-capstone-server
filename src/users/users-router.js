const path = require('path')
const express = require('express')
const xss = require('xss')
const userService = require('./users-service')

const userRouter = express.Router();
const jsonParser = express.json();

const serializeUsers = user => ({
    id: user.id,
    username: xss(user.username),
    pwd: user.pwd
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














module.exports = userRouter