// Import requirements
const { table } = require('table');
const EmployeeApp = require('./EmployeeApp');


async function main() {
    const app = new EmployeeApp();
    await app.run();
    return;
}

main();




// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database