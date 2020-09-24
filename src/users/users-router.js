const path = require('path')
const express = require('express')
const xss = require('xss')
const userService = require('./users-service');
const { insertUser } = require('./users-service');

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
        const { username, pwd, email } = req.body;
        
        console.log('username:', username, "password:", pwd, "email:", email)

        for (const field of ['username', 'pwd', 'email' ])
            if(field === null)
                return res.status(400).json({
                    error: {
                        message: `Missing ${field} in request`
                    }
            })
            const newUser = {username, pwd, email};
            userService.insertUser(
                req.app.get('db'),
                newUser
            )
            .then(user => {
                res
                .status(201)
                .location('/users/:userid')
                .json(serializeUsers(user))
            })
            .catch(next)
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
//update route
    .put(jsonParser, (req, res, next) => {
        const {
            userid,
            username,
            pwd,
            email
        } = req.body
        const userToUpdate = {
            userid,
            username,
            pwd,
            email
        }
        
        const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must content either 'title' or 'completed'`
                }
            })

        userService.updateUser(
                req.app.get('db'),
                req.params.userid,
                userToUpdate
            )
            .then(updateUser => {
                res.status(200).json(serializeUsers(updateUser[0]))
            })
            .catch(next)
    })
// delete route
    .delete((req, res, next) => {
        const { userid } = req.params;
        userService.deleteUser(
                req.app.get('db'),
                req.params.userid
            )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
module.exports = userRouter