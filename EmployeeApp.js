const inquirer = require('inquirer');
const { table } = require('table');
const EmployeesDao = require('./dao/EmployeesDao');

class EmployeeApp {
    #employeesDao;
    #tableHeaders = {
        'roles': [
            "id", "Title", "Department", "Salary"
        ],
        'employees': [
            'id', 'First Name', 'Last Name', 'Role', 'Department', "Manager"
        ],
        'departments': [
            'id', 'Name'

        ]
    };

    async init() {
        // Set employeesDao
        this.#employeesDao = new EmployeesDao();
        await this.#employeesDao.setConnection();
    }

    #render(rows) {
        console.log(table(rows));
    }
    async mainMenu() {
        const response = await inquirer.prompt([
            {
                name:"main",
                message:"What would you like to do",
                type: "list",
                choices: [
                    "View All Employees",
                    "View All Roles",
                    "View All Departments",
                    "Add A Department",
                    "Add A Role",
                    "Add An Employee",
                    "Update Employee Role",
                    "Quit"
                ]

            }
        ]);

        switch(response.main){
            
            case "Quit":
                console.log("Exiting");
                return;

            case "View All Employees":
                await this.renderEmployees();
                // Re-prompt main menu prompt
                // await this.mainMenu();
                break;
            
            case "View All Roles":

                // Re-prompt main menu prompt
                await this.renderRoles();
                // await this.mainMenu();
                

                break;

            case "View All Departments":
                //WHEN I choose to view all departments
                //THEN I am presented with a formatted table showing department names and department ids
                await this.renderDepartments();
                // await this.mainMenu();
                break;

            case "Add A Department":
                await this.insertDepartment();
                break;

            case "Add A Role":
                await this.insertRole();
                break;

            case "Add An Employee":
                await this.insertEmployee();
                break;
            
            case "Update Employee Role":
                await this.updateEmployeeRole();
                break;


            default:
                console.log("Something went wrong, please start again.");
                return;
        }

        await this.mainMenu();
    }
    
    
    async run() {
        await this.init();
        await this.mainMenu();

        return;
        
    }

    async renderEmployees() {
        // WHEN I choose to view all employees
        // THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

        // Query data from database
        const queryResults = await this.#employeesDao.fetchAllEmployeesJoinRole();

        // Pull needed data
        const data = queryResults[0];

        // Format into rows
        const rows = data.map(row => Object.values(row));

        // set headers
        const headers = this.#tableHeaders['employees'];

        // Add headers to table
        rows.unshift(headers);

        // Render table
        await this.#render(rows);
        
    }

    async renderDepartments() {

        //WHEN I choose to view all departments
        //THEN I am presented with a formatted table showing department names and department ids
        const queryResults = await this.#employeesDao.fetchAllDepartments();

        const data = queryResults[0];

        const rows = data.map(row => Object.values(row));
        const headers = this.#tableHeaders['departments'];

    
        rows.unshift(headers);
        await this.#render(rows);

    }

    async renderRoles(){
        // WHEN I choose to view all roles
        // THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

        const queryResults = await this.#employeesDao.fetchAllRoles();
        const data = queryResults[0];

        const rows = data.map(row => Object.values(row));
        const headers = this.#tableHeaders['roles'];

    
        rows.unshift(headers);
        await this.#render(rows);
    }


    async insertDepartment() {
        // WHEN I choose to add a department
        // THEN I am prompted to enter the name of the department and that department is added to the database
        const response = await inquirer.prompt([
            {
                name: 'departmentName',
                message: 'What is the department name',
                type: 'input'
            }
        ]);

        await this.#employeesDao.insertDepartment(response.departmentName);
    }

    async insertRole() {
        // WHEN I choose to add a role
        // THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database


        // Get current departments in database
        const departmentQuery = await this.#employeesDao.fetchAllDepartments();
        // Convert array of objects to array of values
        const choices = departmentQuery[0].map(row => row.name);

        const response = await inquirer.prompt([
            {
                name:'title',
                message:'What is the role title',
                type:'input'
            },
            {
                name:'salary',
                message:'What is the salary',
                type:'input'
            },
            {
                name:'department',
                message:'Which department does this role belong to',
                type: 'list',
                choices: choices
            }
        ]);

        // Pull chosen department from initial query (used to insert FOREIGN KEY department_id)
        const department = departmentQuery[0].filter(department => department.name === response.department)[0];

        
        await this.#employeesDao.insertRole(
            response.title,
            response.salary,
            department.department_id
        );
    }

    async insertEmployee() {
        // WHEN I choose to add an employee
        // THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
        
        // Get all available roles and employees AS managers
        const rolesQuery = await this.#employeesDao.fetchAllRoles();
        const managersQuery = await this.#employeesDao.fetchAllEmployees();


        // Convert roles and managers into arrays
        const rolesChoices = rolesQuery[0].map(role => role.title);
        const managerChoices = managersQuery[0].map(manager => `${manager.first_name} ${manager.last_name}`);
        const noManager = "Not Applicable"
        // Add option for no manager
        managerChoices.push(noManager);

        //Prompt for input
        const response = await inquirer.prompt([
            {
                name: "firstName",
                message: "What is their first name",
                type: "input"
            },
            {
                name: "lastName",
                message: "What is their last name",
                type: "input"
            },
            {
                name: "title",
                message:"What is thier role",
                type: "list",
                choices: rolesChoices
            },
            {
                name:"manager",
                message: "Who is their manager (if any)",
                type: "list",
                choices: managerChoices
            }
        ]);

        // Extract role and manager objects
        const role = rolesQuery[0].filter(role => role.title === response.title)[0];
        
        let manager_id;
        if(response.manager != noManager) {
            let manager = managersQuery[0].filter(manager => `${manager.first_name} ${manager.last_name}` === response.manager)[0];
            manager_id = manager.employee_id;
        }

        await this.#employeesDao.insertEmployee(
            response.firstName,
            response.lastName,
            role.role_id,
            manager_id
        );
    }

    async updateEmployeeRole() {
        // Get roles and employees
        const rolesQuery = await this.#employeesDao.fetchAllRoles();
        const employeesQuery = await this.#employeesDao.fetchAllEmployees();

        // Convert to useable arrays for inquirer
        const rolesChoices = rolesQuery[0].map(role => role.title);
        const employeesChoices = employeesQuery[0].map(employee => `${employee.first_name} ${employee.last_name}`);

        // Prompt for input
        const response = await inquirer.prompt([
            {
                name: "employee",
                message: "Which employee would you like to update",
                type: 'list',
                choices: employeesChoices
            },
            {
                name: 'title',
                message: "What is their new role?",
                type:"list",
                choices: rolesChoices
            }
            
        ]);

        // Get employee from response
        const employee = employeesQuery[0].filter(employee => `${employee.first_name} ${employee.last_name}` === response.employee)[0];

        // Get role from response
        const role = rolesQuery[0].filter(role => role.title === response.title)[0];

        // Call database update
        await this.#employeesDao.updateEmployeeRole(
            employee.employee_id,
            role.role_id,
            employee.role_id
        );
    }

}

module.exports = EmployeeApp;