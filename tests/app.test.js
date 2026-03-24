import { jest } from "@jest/globals"; //Jest requires you to explicitly 
                                      //import its globals if you want to use advanced features (like mocking).

/*
Supertest is a library that allows you to test HTTP servers without actually starting them on a real port (like 5000).
It "simulates" the request and feeds it directly into your Express app.
*/
import request from "supertest"; 
import app from "../src/app.js";



describe("app", () => { //describe is used to group related tests together. 
                        //Think of it as a folder for your tests. 
                        //Here, you are saying: "All tests inside this block are specifically about the app configuration."


  /*
test("returns 404 for unknown route", async () => { ... });:
- This is the individual test case. The string is the human-readable description of what should happen.
- async: Since network requests (even simulated ones) take time, you must use an asynchronous function so you can await the response.
- const res = await request(app).get("/unknown-route");:
- request(app): Tells Supertest to look at your Express app.
- .get("/unknown-route"): Simulates a GET request to a URL that you haven't defined in your code.
- res: This object now contains everything the server sent back (status code, body, headers).
  */
  test("returns 404 for unknown route", async () => {
    const res = await request(app).get("/unknown-route");
    
    expect(res.statusCode).toBe(404); //This checks the HTTP status code. Since the route /unknown-route does not exist,
                                      //a well-behaved API should return a 404. 
                                      //If your server returns a 200 or 500, this test will fail.
    
                                      
    expect(res.body.error).toBe("Route not Found");

    /*
This checks the JSON response body.
    - res.body: Supertest automatically parses the JSON sent by your res.json() in the backend.

    - .error: It looks for the key named error.

    - "Route not Found": It checks if the string matches exactly.
    */
  });
});