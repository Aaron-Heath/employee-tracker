# Employee Tracker CLI
## Description
This application is a Command Line Interface to store and manage employee information for your enterprise. This application uses inquirer to build the command line interface the use interacts with to interact with the database. The database is MySQL and is maintained on the local machine, however it can be configured to connect to any mySQL database that the user has the credentials to use.

The Employee Tracker CLI uses a data access object to manage all queries to the database. This allows the same queries to be easily reused across the application and keeps the primary functions organized within the directories.

A recording of the application's primary functionality can be found [here](https://drive.google.com/drive/u/0/folders/1lPle4himivvQnK1Ve-89LOgynFuwD1PZ).

## Installation

Clone or fork this repository to your local machine. Be sure to `npm install inquirer@8.2.4` and `npm install mysql2`.

## Usage

From the root directory of the application, run `node index.js` to begin the application. Follow the prompts to read and manipulate the database.

## Credits

N/A