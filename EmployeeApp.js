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
                    // Query data from database
                    queryResults = await this.#employeesDao.fetchAllEmployees();

                    // Pull needed data
                    data = queryResults[0];

                    // Format into rows
                    rows = data.map(row => Object.values(row));

                    // set headers
                    headers = this.#tableHeaders['employees'];

                    // Add headers to table
                    rows.unshift(headers);

                    // Render table
                    this.#render(rows);


                    // Re-prompt main menu prompt
                    this.#menus.main();
                    break;
                
                case "View All Roles":
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
                    //WHEN I choose to view all departments
                    //THEN I am presented with a formatted table showing department names and department ids
                
                    default:
                    console.log("Something went wrong, please start again.");
                    return;
            }


        } ;
    }

    #render(rows) {
        console.log(table(rows));
    }

    async run() {
        await this.init();
        await this.#menus.main();

        return;
        
    }

    async prompt(promptName) {

    }
}

module.exports = EmployeeApp;