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
    address: emp.emp_address,
    st: emp.emp_st,
    zip: emp.emp_zip,
    office: emp.office_location,
    role: emp.emp_roles
})
//get all employees 
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
    //post route
    .post(jsonParser, (req, res, next) => {
        const { fname, lname, email, emp_address, emp_st, emp_zip, office_location, emp_roles } = req.body;
        

        for (const field of ['fname', 'lname', 'email', 'emp_address', 'emp_st', 'emp_zip', 'office_location', 'emp_roles' ])
            if(field === null)
                return res.status(400).json({
                    error: {
                        message: `Missing ${field} in request`
                    }
            })
            const newEmployee = {fname, lname, email, emp_address, emp_st, emp_zip, office_location, emp_roles};
            EmployeeService.insertEmployee(
                req.app.get('db'),
                newEmployee
            )
            .then(employee => {
                res
                .status(201)
                .location('/employees/:emp_id')
                .json(serializeEmployees(employee))
            })
            .catch(next)
    })
//get employees by id
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
    //update route
    .put(jsonParser, (req, res, next) => {
        const {
            emp_id,
            fname,
            lname,
            email,
            emp_address,
            emp_st,
            emp_zip,
            office_location,
            emp_roles
        } = req.body
        const employeeToUpdate = {
            emp_id,
            fname,
            lname,
            email,
            emp_address,
            emp_st,
            emp_zip,
            office_location,
            emp_roles
        }
        
        const numberOfValues = Object.values(employeeToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must content either 'title' or 'completed'`
                }
            })

        EmployeeService.updateEmployee(
                req.app.get('db'),
                req.params.emp_id,
                employeeToUpdate
            )
            .then(updateEmployee => {
                res.status(200).json(serializeEmployees(updateEmployee[0]))
            })
            .catch(next)
    })
// delete route
    .delete((req, res, next) => {
        const { emp_id } = req.params;
        EmployeeService.deleteEmployee(
                req.app.get('db'),
                req.params.emp_id
            )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
module.exports = employeeRouter