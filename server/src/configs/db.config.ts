import mongoose from 'mongoose';

const connectDB = async (DB: string): Promise<void> => {
    try {
        const conn = await mongoose.connect(DB);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error connecting to MongoDB: ${error.message}`);
        } else {
            console.error(`Unexpected error: ${error}`);
        }
        process.exit(1);
    }
};

export default connectDB;
