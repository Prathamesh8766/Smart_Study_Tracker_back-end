import mongoose from 'mongoose';// This is the library for connection with the mongodb data base of an app
import bcrypt from 'bcryptjs';//It is a password-security library. Used to protect passwaods befroe they are stored in the 												
// database by hashing them. it only encrypts the pssword dicription is not possible. 

export const userSchema = new mongoose.Schema( //This is how the schema is used; it defines the structure and rules of your data.
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            minlength: 5
        },

    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function () { // Here pre is a document midleware and save is hook.
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10); //salt is a random string attached to the password .geSalt() generat it.
    this.password = await bcrypt.hash(this.password, salt);// this refere to document taht means document.passwaord
});

userSchema.methods.matchPassword = async function name(enterPassword) {//.methods is used to add custom functions to the schema.
    return await bcrypt.compare(enterPassword, this.password) //.compare method used to compare the entered password and the hashed password by taking out the salt from the hash, 
};

const User = mongoose.model('User', userSchema);  //Here the "User" is a collection name and userSchema is a schema. After this, 
// User becomes a powerful object that you use everywhere in your app.
export default User; 

// What is schema? 
// Ans: In Mongoose, a schema defines the structure of documents inside a MongoDB collection.