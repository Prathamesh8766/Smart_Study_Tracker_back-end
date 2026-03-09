import {body} from 'express-validator'
import express from 'express'

import {
    register,
    login,
    getprofile
} from '../controllers/authController.js'

import protect from '../middleware/auth.js'

const routes = express.Router();

const registeValidator = [
    body('username')
    .trim()
    .isLength({min: 3})
    .withMessage('User name atlest 3 charater'),
    body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage('Pleas provid valid email'),
    body('password')
    .notEmpty()
    .withMessage("Password is required")

];

const loginValidator = [
    body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage('Pleas provid valid email'),
    body('password')
    .notEmpty()
    .withMessage("Password is required")

];

//Public Route
routes.post("/register", registeValidator,register);
routes.post('/login', loginValidator, login);

//Protected
routes.get('/getprofile', protect, getprofile);

export default routes;

/* 
1) What is router?
ans: A Router is used to define application routes and map them to controllers.
     A route tells the server which function should run when a specific URL and HTTP method is requested.
     Router are used to:
     1) Organize API endpoints
     2) Connect routes to controllers
     3) Keep project structure clean

2) What is Express?
ans: Express is a Node.js web framework used to build APIs and web servers easily.
    Node.js alone is very low-level.
    Express provides simple tools to handle HTTP requests, routes, middleware, and responses.
    Express makes things easier like:
    1) Routing
    2) Middleware
    3) Request handling
    4) Response handling
    5) API building

3) What is express.Router()?
ans:express.Router() is a mini router system inside Express.
    It allows you to create separate route modules for different parts of your application.
    Instead of putting all routes in one file, we divide them.

4) What is express-validator?
ans:express-validator is a middleware library used to validate and sanitize user input in Express applications.
    1) It helps prevent:
    2) Invalid data
    3) Empty fields
    4) Security issues
**/