const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server error";

  if (err.name === "CastError") {  // When this error occure? 
                                   //In Mongoose, this happens when: You pass an invalid MongoDB ObjectId.
    message = "Resource not found";
    statusCode = 404;
  }

  if (err.code === 11000) {       //In MongoDB, error code 11000 means: Duplicate unique field

    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
    statusCode = 400;
  }

  if (err.name === "ValidationError") { // This happens when schema validation fails. 
    /**
    
     username: {
     type: String,
     required: true,
      minlength: 3
  }
If user sends:

    { "username": "" }

Mongoose throws ValidationError.

     */

    message = Object.values(err.errors)
      .map(val => val.message)
      .join(", ");
    statusCode = 400;
  }

  if (err.name === "JsonWebTokenError") {
    message = "Invalid token";
    statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    message = "Token expired";
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }) // this is the advance javascript is the development env then
                                                                        // it add "stack": "error stack trace here"
  });
};

export default errorHandler;
