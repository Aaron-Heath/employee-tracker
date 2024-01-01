const mysql2 = require('mysql2/promise');


class EmployeesDao {
    #connection;

    constructor(mysqlConnection = null) {
        this.#connection = mysqlConnection;
    }

    async setConnection() {
        this.#connection = await mysql2.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'rootroot',
            database: 'employees_db'
        });
    }

    // WHEN I choose to view all employees
    // THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
    async fetchAllEmployees() {
        return await this.#connection.query(
            `SELECT 
                employee.employee_id,
                employee.first_name,
                employee.last_name,
                role.title AS role,
                department.name AS department,
                CONCAT(manager.first_name, " ",manager.last_name) as manager
            FROM employee
                JOIN role ON employee.role_id = role.role_id
                JOIN department ON department.department_id = role.department_id
                LEFT OUTER JOIN employee manager ON manager.employee_id = employee.manager_id;`
        );
    }

    // WHEN I choose to view all departments
    // THEN I am presented with a formatted table showing department names and department ids
    async fetchAllDepartments() {
        return await this.#connection.query("SELECT * FROM department");
    }

    // WHEN I choose to view all roles
    // THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
    async fetchAllRoles() {
        return await this.#connection.query("SELECT role.role_id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.department_id");
    }
}

module.exports = EmployeesDao;