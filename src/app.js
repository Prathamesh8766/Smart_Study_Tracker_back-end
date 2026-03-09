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

Used when HTML forms send data.

Example form body:
email=user@gmail.com&password=123456

extended:true
Allows nested objects using qs library.
*/
app.use(express.urlencoded({ extended: true }));

/*
CORS Configuration

Allows frontend applications running on
different origins to access the API.
*/
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
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

/*
Export app so it can be used by:

- server.js
- test files
*/
export default app;