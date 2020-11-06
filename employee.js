const { prompt } = require("inquirer");
const db = require("./db");

init();

//function that starts the command line
function init() {
  console.log("Hello, How are you today?");
  console.log("Employee Tracker System");
  mainMenu();
}

//main menu all functions lead back to this
async function mainMenu() {
  const { choice } = await prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View All Employees",
          value: "viewEmployees",
        },
        {
          name: "Add Employee",
          value: "addEmployee",
        },
        {
          name: "Remove Employee",
          value: "removeEmployee",
        },
        {
          name: "Update Employee Role",
          value: "updateEmployeeRole",
        },
        {
          name: "View All Roles",
          value: "viewAllRoles",
        },
        {
          name: "Add Role",
          value: "addRole",
        },
        {
          name: "Remove Role",
          value: "deleteRoles",
        },
        {
          name: "View All Departments",
          value: "viewAllDepartments",
        },
        {
          name: "Add Department",
          value: "addDepartment",
        },
        {
          name: "Remove Department",
          value: "deleteDepartment",
        },
        {
          name: "Quit",
          value: "quit",
        },
      ],
    },
  ]);

  //this takes the user input and sends them to the other functions below
  switch (choice) {
    case "viewEmployees":
      return viewEmployees();
    case "addEmployee":
      return addEmployee();
    case "removeEmployee":
      return deleteEmployee();
    case "updateEmployeeRole":
      return updateEmployeeRole();
    case "viewAllRoles":
      return viewRoles();
    case "addRole":
      return addRoles();
    case "deleteRoles":
      return deleteRoles();
    case "viewAllDepartments":
      return viewDepartments();
    case "addDepartment":
      return addDepartment();
    case "deleteDepartment":
      return deleteDepartment();
    case "quit":
      return quit();
  }
}

//takes the employees from the chart and displays them in a table
async function viewEmployees() {
  const employees = await db.findAllEmployees();

  console.table(employees);

  mainMenu();
}

//  add an employee to the table
async function addEmployee() {
  //finds the roles that can be added
  const roles = await db.findAllRoles();
  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));
  //finds the managers available
  const employees = await db.findAllEmployees();
  const managerChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  //questions about the employee
  const employee = await prompt([
    {
      name: "first_name",
      message: "What is the employees first name?",
    },
    {
      name: "last_name",
      message: "What is the employees last name?",
    },
    {
      type: "list",
      name: "role_id",
      message: "What is the employee's role?",
      choices: roleChoices,
    },
    {
      type: "list",
      name: "manager_id",
      message: "Who is the employees manager if needed?",
      choices: managerChoices,
    },
  ]);

  //sends this information to the function create Employee
  await db.createEmployee(employee);

  console.log("The new employee has been added to the database");

  mainMenu();
}

//ability to deleteEmployee
async function deleteEmployee() {
  //grabs available employees
  const employees = await db.findAllEmployees();
  const employeesChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));

  //user input for the deletee
  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Who is the employee that needs to be removed?",
      choices: employeesChoices,
    },
  ]);

  //sends this information to the function delete Employee
  await db.deleteEmployee(employeeId);

  console.log("Employee has been removed from base");

  mainMenu();
}

//ability to update an Employees Role
async function updateEmployeeRole() {
  //grabs employee information
  const employees = await db.findAllEmployees();
  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  //grabs role information
  const roles = await db.findAllRoles();
  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  //grabs information about the update
  const { id } = await prompt([
    {
      type: "list",
      name: "id",
      message: "Which employee would you like to update?",
      choices: employeeChoices,
    },
  ]);

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "Which role would you like to give them?",
      choices: roleChoices,
    },
  ]);
  //sends this information to the function update Employee Role
  await db.updateEmployeeRole(id, roleId);

  console.log("Updated employee Role");

  mainMenu();
}

//ability to viewRoles
async function viewRoles() {
  //grabs information about roles
  const roles = await db.findAllRoles();

  console.table(roles);

  mainMenu();
}

//ability to addRoles
async function addRoles() {
  //grabs departments
  const departments = await db.findAllDepartments();

  const departmentChoices = departments.map(({ id, department }) => ({
    name: department,
    value: id,
  }));
  //grabs information about the new roles
  const role = await prompt([
    {
      name: "title",
      message: "What is the name of the Role you would like to add?",
    },
    {
      name: "salary",
      message: "What is the salary of this role going to be?",
    },
    {
      type: "list",
      name: "department_id",
      message: "Which department would you like to add this role to?",
      choices: departmentChoices,
    },
  ]);
  //sends this information to the function create Role
  await db.createRole(role);

  console.log("The new role has been added to the database");

  mainMenu();
}

//ability to delete Roles
async function deleteRoles() {
  //grabs roles from the database
  const roles = await db.findAllRoles();
  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  //grabs information about the role about to be deleted
  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "What is the role that you would like to remove?",
      choices: roleChoices,
    },
  ]);

  //sends this information to the function delete Role
  await db.deleteRole(roleId);

  console.log("The role has been removed from the company");

  mainMenu();
}

//ability to see the departments
async function viewDepartments() {
  const departments = await db.findAllDepartments();

  console.table(departments);

  mainMenu();
}

//ability to add departments
async function addDepartment() {
  //grabs information about the new department
  const department = await prompt([
    {
      name: "name",
      message: "What is the name of the Department you would like to add?",
    },
  ]);
  //sends this information to the function create Department
  await db.createDepartment(department);

  console.log("The new department has been added to the database");

  mainMenu();
}

//ability to deleteDepartment
async function deleteDepartment() {
  //grabs the department information
  const department = await db.findAllDepartments();
  const departmentChoices = department.map(({ id, department }) => ({
    name: department,
    value: id,
  }));

  //gathers information about the deleted department
  const { departmentId } = await prompt([
    {
      type: "list",
      name: "departmentId",
      message: "What is the department that you would like to remove?",
      choices: departmentChoices,
    },
  ]);

  //sends this information to the function delete Employee
  await db.deleteDepartment(departmentId);

  console.log("The department has been removed from the company");

  mainMenu();
}
//exits out of the main menu
function quit() {
  console.log("bye!");
  console.log("Have a nice Day!");
  process.exit();
}