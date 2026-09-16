import dns from "node:dns";
import mongoose from "mongoose";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected");
  } catch (err) {
    console.log(err);
    console.log("Could Not Connect to the Database");
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  await mongoose.disconnect();
  console.log("Database Disconnected!");
  process.exit(0);
});
