import jwt from 'jsonwebtoken';
import User from '../models/User.js'

const protect = async (req, res, next) => {
    let token;

    // Check if the autho conatin token
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(' ')[1]
      
    }
    // conferm ther is a token else return immidetly
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, no token provided",
        });
    }

    try {
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);// Checks if token is valid, Checks if token is expired,Decodes payload
        // get user
        const user = await User.findById(decoded.id).select("-password");

        // return if no user exist
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists",
            });;
        }

        req.user = user;
        return next() //next is like my job is done now you will handle the rest

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token has expired",
            });
        }

        return res.status(401).json({
            success: false,
            message: "Not authorized, token invalid",
        });
    }
    return res.status(401).json({
        success: false,
        message: "Not authorized, token invalid",
    });

}

export default protect;
