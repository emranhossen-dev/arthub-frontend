import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

if (!process.env.MONGO_DB_URI) {
  throw new Error("Please add your MONGO_DB_URI to .env");
}

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db("ArtHub"); // database name

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  baseURL: process.env.BETTER_AUTH_URL || "https://arthubemran.netlify.app",
  emailAndPassword: { enabled: true },
  
  // CORS & Security Allowed Origins
  trustedOrigins: [
    "https://arthubemran.netlify.app",
    "http://localhost:3000"
  ],
  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
});
