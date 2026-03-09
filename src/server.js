/*
dotenv module

dotenv is a package that loads environment variables from a .env file
into process.env.

Why needed?
We don't want to hardcode secrets like:
- database password
- JWT secret
- port number

Example .env file:
PORT=8000
MONGO_URI=mongodb://localhost:27017/studytracker
JWT_SECRET=mysecret
NODE_ENV=development

After calling dotenv.config(),
we can access them like:

process.env.PORT
process.env.JWT_SECRET
*/

import dotenv from 'dotenv';



/*
SERVER.JS

Responsibilities:
- Load environment variables
- Connect database
- Start server
*/


import app from './app.js';

/*
Database connection function
*/
import { connectDB } from './config/db.js';

/*
dotenv

Loads variables from .env file
into process.env
*/
dotenv.config();

/*
Connect MongoDB
*/
connectDB();

/*
Port configuration

Uses PORT from .env
Fallback → 8000
*/
const PORT = process.env.PORT || 8000;

/*
Start Express Server
*/
app.listen(PORT, () => {
  console.log(
    `Server running on ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});

/*
Unhandled Promise Rejection Handler

If any async operation fails
without try/catch, Node emits this event.

Example:

await databaseOperation()

If it throws and not caught,
this handler will catch it.
*/
process.on("unhandledRejection", (err) => {

  console.error("Unhandled Rejection:", err.message);

  process.exit(1);

});
/*
In Node.js, process is a global object that gives information and control over the current Node.js application process (the running program).

You do not need to import it — Node.js provides it automatically.
 What is process in Node.js
process represents the current running Node.js program.

It allows you to:
Read environment variables
Access command-line arguments
Handle system events
Exit the program
Get system information (memory, platform, etc.)

Think of it like:

A controller that manages the running Node.js application.
*/