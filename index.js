// Import requirements
const inquirer = require('inquirer');
const EmployeesDao = require('./dao/EmployeesDao');
const mysql = require('mysql2/promise');

async function main() {

    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'employees_db'
    });

    const employeesDao = new EmployeesDao(connection);
 

    const data = await employeesDao.fetchAllRoles();
    console.log(data);

}

main();




// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database