const employeeService = {
    // all employees search
    getEmployees(db) {
        return db
            .from('employees')
            .select(
                'employees.emp_id',
                'employees.fname',
                'employees.lname',
                'employees.email',
                'employees.emp_address',
                'employees.emp_st',
                'employees.emp_zip',
                'employees.office_location',
            )
    }, 
    //get employees by ids
    getEmployeesById(db, emp_id) {
        return db
            .from('employees')
            .select("*")
            .where('employees.emp_id', emp_id)
            .first()
    },
    //relevant
    insertEmployee(db, newEmployee) {
        return db
            .insert(newEmployee)
            .into('employees')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    //relevant
    updateEmployee(db, emp_id, newEmployee) {
        return db('employees')
            .where({
                emp_id: emp_id
            })
            .update(newEmployee, returning = true)
            .returning('*')
    },
    //relevant
    deleteEmployee(db, emp_id) {
        console.log("employee ids:", emp_id)
        return db('employees')
            .where({
                emp_id: emp_id
            })
            .delete()
    }
}

module.exports = employeeService