// Import requirements
const { table } = require('table');
const EmployeeApp = require('./EmployeeApp');


async function main() {
    const app = new EmployeeApp();
    await app.run();
    return;
}

main();