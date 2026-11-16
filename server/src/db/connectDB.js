import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const DB_CONNECTION_STRING =
      process.env.NODE_ENV === "development"
        ? process.env.MONGO_LOCAL_API_URL
        : process.env.MONGO_API_URL;

    if (!DB_CONNECTION_STRING) {
      throw new Error("Database connection string is not defined");
    }

    const dbResponse = await mongoose.connect(DB_CONNECTION_STRING);

    console.log("Database Connected", dbResponse.connection.host);
  } catch (error) {
    console.log("Fail to connect Database", error);
    process.exit(1);
  }
};
