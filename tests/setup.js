import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({path: ".env.test"}); // If coverage drops below this, tests fail.

beforeAll(async () => {        // before all is a jset lifecycle hook. It runs once before tests start.
                              // - Purpose here: Connect to MongoDB before tests run.
  await mongoose.connect(process.env.MONGODB_URL);
});

afterAll(async () => {     // after all is also a jset lifecycle hook. 
                          // - purpose here: Disconnect to mongoDB after test complet.
                          // If you don't close connection Jest may hang.
  await mongoose.connection.close();
});


/*
What is the use of this file?
Ans: This file prepares test enviroment.
*/