import mongoose from 'mongoose';

export const connectDB = async () =>{
    try{
        const connect = await mongoose.connect(process.env.MONGODB_URL) //Expain me this monoose.connect,   and process
        console.log(`Connect to MongoDB ${connect.connection.host}`);
    }catch(error){
        console.error(`Error in MongoDB Connection ${error.message}`);
        process.exit(1);
    }
}