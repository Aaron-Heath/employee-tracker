const inquirer = require('inquirer');
const { table } = require('table');
const EmployeesDao = require('./dao/EmployeesDao');

class EmployeeApp {
    #employeesDao;
    #menus = {};
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
        // Query data from database
        const queryResults = await this.#employeesDao.fetchAllEmployees();

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
        const queryResults = await this.#employeesDao.fetchAllRoles();
        const data = queryResults[0];

        const rows = data.map(row => Object.values(row));
        const headers = this.#tableHeaders['roles'];

    
        rows.unshift(headers);
        await this.#render(rows);
    }


    async insertDepartment() {
        const response = await inquirer.prompt([
            {
                name: 'departmentName',
                message: 'What is the department name',
                type: 'input'
            }
        ]);

        await this.#employeesDao.insertDepartment(response.departmentName);
    }

}

module.exports = EmployeeApp;