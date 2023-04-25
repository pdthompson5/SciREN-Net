import type { User, GetUserResponse } from "./userSession";

import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";
import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
import { UserWithID, getUserCollection } from "@/lib/database";

// Login API Endpoint

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  
  const { email, password } = await req.body;
  try {
    // User Validation
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      // admin error, need to make sure this isn't displayed to user
      throw new Error(
        "Missing MongoDB connection string (MONGO_URI). Update server parameters."
      );
    }

    // TODO: Add error catching for mongo document
    const client = new MongoClient(mongoURI);
    console.log("Connected to MongoDB");
    const userCollection = getUserCollection(client);


    const userCursor = await userCollection.find(
      {
        email: email,
      }
    );
    const userDoc = (await userCursor.next()) as UserWithID;
    const multipleMatches = await userCursor.hasNext();
    if (userDoc == null) {
      throw new Error("No user associated with the provided email.");
    } else if (multipleMatches) {
      throw new Error(
        "Multiple users found for provided email. This is a bug, contact site administrator."
      );
    }
    // Password validation
    // Replace with assertion?
    if (userDoc.password != password) {
      throw new Error("Username / Password mismatch. Please try again.");
    }

    console.log("api/login : Completed profile retrieval for " + email);

    // Save retrieved user
    const user: GetUserResponse = {
      isLoggedIn: true,
      userID: userDoc._id.toString(),
      ...userDoc
    };
    req.session.user = user;
    await req.session.save();
    res.json(user);
  } catch (error) {
    // Respond with error
    res.status(500).json({ message: (error as Error).message });
  }
}
