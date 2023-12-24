import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    const password = process.env.MONGO_PASSWORD;
    const user = process.env.MONGO_USER;
    await mongoose.connect(
      `mongodb+srv://${user}:${password}@main.ygfyp56.mongodb.net/?retryWrites=true&w=majority`,
    );
    console.log("Connected");
  } catch (e) {
    throw new Error("Unsuccessful connection to database: " + e);
  }
};
