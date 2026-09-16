import { createClient } from "redis";
const redisUrl = process.env.REDIS_URL

const redisClient = createClient({
  url : redisUrl,
});

redisClient.on("error", (err) => {
  console.log("Redis Client Error", err);
  process.exit(1);
});

await redisClient.connect();

export default redisClient;
