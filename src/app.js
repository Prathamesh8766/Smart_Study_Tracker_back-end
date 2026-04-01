/*
APP.JS

This file configures the Express application.

Responsibilities:
- Load middlewares
- Configure CORS
- Mount routes
- Setup error handling

It DOES NOT start the server.
This allows testing frameworks like Jest to import the app.
*/

import express from 'express';


/*
CORS stands for Cross-Origin Resource Sharing. By default, web browsers block a website (like my-frontend.com) 
from making an API request to a different domain (like my-api.com) for security reasons. This middleware "loosens"
 those rules so your frontend can actually talk to your backend.
*/
import cors from 'cors';

/*
Routes

Routes connect HTTP endpoints to controllers.

Example:
POST /api/auth/login
GET /api/subject
POST /api/studySession
*/
import authRoutes from './routes/authRoutes.js';
import studySessionRoutes from './routes/studySessionRoutes.js';
import subjectRoutes from './routes/subjectRouters.js';

/*
Global error handling middleware.

This catches errors thrown in controllers
and sends proper response to the client.
*/
import errorHandler from './middleware/errorHandler.js';

/*
Create Express Application

This creates the main server object.
All routes and middleware attach to this.
*/
const app = express();

/*
express.json()

Allows server to read JSON request body.

Example request:

POST /login
{
 "email":"user@gmail.com",
 "password":"123456"
}

Without this middleware:
req.body would be undefined.
*/
app.use(express.json());

/*
express.urlencoded()

What it is: This is a built-in middleware in Express that parses incoming requests with URL-encoded payloads.

Why it's used:
When you submit a standard HTML <form>, the browser sends the data in a format that looks like this: name=Prathamesh&branch=CSE.
 This middleware takes that "string" and turns it into a clean JavaScript object: { name: "Prathamesh", branch: "CSE" },
 which you can then access via req.body.

false: Uses the querystring library. It can only parse simple strings/arrays.
true: Uses the qs library. It allows you to parse nested objects.
Example: If your form sends data for a nested object like user[name]=Prathamesh&user[age]=21, setting extended: true allows Express to
*/
app.use(express.urlencoded({ extended: true }));

/*
CORS Configuration

Allows frontend applications running on
different origins to access the API.
*/
app.use(
  cors({
    origin: "*",  //The asterisk * is a wildcard meaning "Allow any website to access this API." * 
                  //Example: If your frontend is on Localhost:3000 and your backend is on Localhost:5000,
                  //without this, the browser will block the login request.

    methods: ["GET", "POST", "PUT", "DELETE"],//What actions are allowed? setttin : fIt restricts which HTTP verbs a frontend can use.

    allowedHeaders: ["Content-Type", "Authorization"], //What extra info can they send? setting : Content-Type: Required to send JSON data.
                                                       //Authorization: Required to send JWT Tokens in the header for protected routes.

    credentials: true,                                 //Can they send cookies/auth headers? setting:
                                                       //This allows the browser to include cookies or the Authorization header in the cross-origin request.
  })
);

/*
Route mounting

/api/auth → authentication routes
/api/studySession → study session routes
/api/subject → subject routes
*/
app.use('/api/auth', authRoutes);
app.use('/api/studySession', studySessionRoutes);
app.use('/api/subject', subjectRoutes);

/*
Global Error Handler

Handles errors thrown from controllers.
*/
app.use(errorHandler);

/*
Export app so it can be used by:

- server.js
- test files
*/

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is healthy and fine project run succes fuly" });
});

/*
404 Route Handler

Runs when no route matches request.
*/
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not Found",
    statusCode: 404,
  });
});


export default app;