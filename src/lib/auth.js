import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const mongoUri =
  process.env.MONGO_DB_URI ||
  "mongodb+srv://emranwebsites_db_user:Ynq8ewf1z6x9vmW7@cluster0.jejvg43.mongodb.net/?appName=Cluster0";

const client = new MongoClient(mongoUri);
const db = client.db("ArtHub");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://arthub.emran.work",
  emailAndPassword: { enabled: true },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: true,
      },
      subscriptionTier: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: true,
      },
    },
  },

  trustedOrigins: [
    "https://arthub.emran.work",
    "https://arthub-backend.emran.work",
    "https://arthubemran.netlify.app",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
  ],

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
});
