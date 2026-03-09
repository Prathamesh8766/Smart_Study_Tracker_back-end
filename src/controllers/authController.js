import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const userExist = await User.findOne({
            $or: [{ email }, { username }], // $or is a MongoDB query operator.
            // It means:
            // Return a document if at least one condition is true
        });

        if (userExist) {
            return res.status(400).json({
                success: false,
                error:
                    userExist.email === email
                        ? "Email already registered"
                        : "Username already taken",
            });
        }

        // Create new user
        const user = await User.create({ username, email, password });

        // Generate token
        const token = await generateToken(user._id);

        // Send response
        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    profileImage: user.profileImage,
                    createdAt: user.createdAt,
                },
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Provide email and password",
            });
        }

        // Find user
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({
                success: false,
                error: "User does not exist",
            });
        }

        // Compare password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate token
        const token = await generateToken(user._id);

        // Send success response
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
            },
            token,
        });
    } catch (error) {
        next(error);
    }
};

export const getprofile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

/*
1) What is controller? 
ans: The controlle is function that handle incoming request ans send responce back to the client.
    It acts as middle lare between models and routes.
    Do the folling opreations:
    1) Recive request data.
    2) validate input.
    3) Call database oprations.
    4) Apply business logic.
    5) Send responce back.

2) What different operations MongoDB has?
ans: 
| Operation  | Meaning       | Example       |
| ---------- | ------------- | ------------- |
| **Create** | Insert data   | `create()`    |
| **Read**   | Retrieve data | `find()`      |
| **Update** | Modify data   | `updateOne()` |
| **Delete** | Remove data   | `deleteOne()` |

Read Opreation:
find()
findOne()
findById()

Update opreation:
updateOne()
updateMany()
findByIdAndUpdate()

Delete Operations:
deleteOne()
deleteMany()
findByIdAndDelete()

3) What is params?
ans: params are values sent in the URL path.
    They are used to identify a specific resource.
    example: /subjects//subjects/645abcd123 
    where  645abcd123 is parameter

    router.get("/subjects/:id", getOneSubjectController)
    where :id is placeholder
**/