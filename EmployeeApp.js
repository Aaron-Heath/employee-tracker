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

        // Set prompts
        this.#menus['main'] = async () => {
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



            console.log(response);
            let queryResults;
            let headers;
            let rows;
            let data;

            switch(response.main){
                
                case "Quit":
                    console.log("Exiting");
                    return;

                case "View All Employees":
                    this.renderEmployees();
                    // Re-prompt main menu prompt
                    this.#menus.main();
                    break;
                
                case "View All Roles":
                    // TODO move to renderRoles
                    queryResults = await this.#employeesDao.fetchAllRoles();
                    data = queryResults[0];
                    console.log(data);
                    rows = data.map(row => Object.values(row));
                    headers = this.#tableHeaders['roles'];

                
                    rows.unshift(headers);
                    this.#render(rows);

                    // Re-prompt main menu prompt
                    this.#menus.main();
                    break;

                case "View All Departments":
                    // TODO move to renderDepartments
                    //WHEN I choose to view all departments
                    //THEN I am presented with a formatted table showing department names and department ids
                    queryResults = await this.#employeesDao.fetchAllDepartments();

                    data = queryResults[0];

                    rows = data.map(row => Object.values(row));
                    headers = this.#tableHeaders['departments'];

                
                    rows.unshift(headers);
                    this.#render(rows);

                    this.#menus.main();
                    break;

                default:
                    console.log("Something went wrong, please start again.");
                    return;
            }


        } ;

        this.#menus['department'] = async () => {
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



        // console.log(response);
        let queryResults;
        let headers;
        let rows;
        let data;

        switch(response.main){
            
            case "Quit":
                console.log("Exiting");
                return;

            case "View All Employees":
                await this.renderEmployees();
                // Re-prompt main menu prompt
                await this.mainMenu();
                // this.#menus.main();
                break;
            
            case "View All Roles":

                // Re-prompt main menu prompt
                await this.renderRoles();
                await this.mainMenu();
                

                break;

            case "View All Departments":
                //WHEN I choose to view all departments
                //THEN I am presented with a formatted table showing department names and department ids
                await this.renderDepartments();
                await this.mainMenu();
                break;

            default:
                console.log("Something went wrong, please start again.");
                return;
        }
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
        console.log(data);
        const rows = data.map(row => Object.values(row));
        const headers = this.#tableHeaders['roles'];

    
        rows.unshift(headers);
        await this.#render(rows);
    }

}

module.exports = EmployeeApp;