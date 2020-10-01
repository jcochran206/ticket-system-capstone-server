require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const {
    NODE_ENV
} = require('./config')
const errorHandler = require('./middleware/error-handler')
const userRouter = require('./users/users-router')
const employeeRouter = require('./employees/employees-router')
const incidentRouter = require('./incidents/incidents-router')

const app = express()

const morganOption = (NODE_ENV === 'production') ?
    'tiny' :
    'common';

app.use(morgan(morganOption, {
    skip: () => NODE_ENV === 'test',
}))
var corsOptions = {
    origin: 'https://ticket-system-capstone-client.vercel.app',
}

app.use(cors())
app.use(helmet())

app.use(express.static('public'))



app.use('/api/users', cors(corsOptions), userRouter)
app.use('/api/employees', cors(corsOptions), employeeRouter)
app.use('/api/incidents', cors(corsOptions), incidentRouter)

app.use(errorHandler)

module.exports = app
