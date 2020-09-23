const path = require('path')
const express = require('express')
const xss = require('xss')
const EmployeeService = require('./employees-service')
const { insertEmployee } = require('./employees-service')

const employeeRouter = express.Router()
const jsonParser = express.json()

const serializeEmployees = emp => ({
    id: emp.emp_id,
    fname: emp.fname,
    lname: emp.lname,
    email: xss(emp.email),
    address: emp.emp_addres,
    st: emp.emp_st,
    zip: emp.emp_zip,
    office: emp.office_location,
    role: emp.emp_roles
})

employeeRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        EmployeeService.getEmployees(knexInstance)
            .then(emps => {
                res.json(emps.map(serializeEmployees))
            })
            .catch(next)
    })
//     .post(jsonParser, (req, res, next) => {
//         //const { username, pwd, email } = req.body;
        
//         //console.log('username:', username, "password:", pwd, "email:", email)

//         for (const field of ['username', 'pwd', 'email' ])
//             if(field === null)
//                 return res.status(400).json({
//                     error: {
//                         message: `Missing ${field} in request`
//                     }
//             })
//             const newUser = {username, pwd, email};
//             userService.insertUser(
//                 req.app.get('db'),
//                 newUser
//             )
//             .then(user => {
//                 res
//                 .status(201)
//                 .location('/users/:userid')
//                 .json(serializeUsers(user))
//             })
//             .catch(next)
//     })
// //getUserbyId
employeeRouter
    .route('/:emp_id')
    .all((req, res, next) => {
        const { emp_id } = req.params;
        EmployeeService.getEmployeesById(req.app.get('db'), emp_id)
            .then(emp_id => {
                if (!emp_id) {
                    return res
                        .status(404)
                        .send({ error: { message: `User doesn't exist.` } })
                }
                res.emp_id = emp_id
                next()
            })
            .catch(next)
    })
    .get((req, res) => {
        res.json(serializeEmployees(res.emp_id))
    })
module.exports = employeeRouter