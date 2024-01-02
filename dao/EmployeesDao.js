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

    async fetchAllEmployees() {
        return await this.#connection.query(
            "SELECT * FROM employee"
        );
    }

        async fetchAllEmployeesJoinRole() {
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

    async fetchAllDepartments() {
        return await this.#connection.query("SELECT * FROM department");
    }

    async fetchAllRoles() {
        return await this.#connection.query("SELECT role.role_id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.department_id");
    }

    async insertDepartment(newDept) {
        return await this.#connection.query(
            `INSERT INTO department (name) VALUES (?)`,
            newDept
        );
    }

    async insertRole(title, salary, department_id) {
        return await this.#connection.query(
            'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
            [title, salary, department_id]
        );
    }

    async insertEmployee(firstName, lastName, role_id, manager_id) {
        /**
         * SQL prepared statement to insert new employee into database.
         * 
         * @param {string} firstName employee first name
         * @param {string} lastName employee last name
         * @param {int} role_id relates to role_id in role_table
         * @param {int} manager_id relates to employee_id in employee table
         */
        return await this.#connection.query(
            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [firstName, lastName, role_id, manager_id]
        );
    }

    async updateEmployeeRole(employee_id, newRole_id, currentRole_id) {
        /**
         * SQL prepared statement to update an existing employee's role
         * @param {int} employee_id employee id used to make the update
         * @param {int} newRole_id new id associated with the new role
         * @param {int} currentRole_id previous role id used to handle race conditions.
         */

        return await this.#connection.query(
            "UPDATE employee SET role_id = ? WHERE employee_id = ? AND role_id = ?",
             [newRole_id, employee_id, currentRole_id], function(err, results) {
                console.log(results);
             }
        );
    }
}

module.exports = EmployeesDao;