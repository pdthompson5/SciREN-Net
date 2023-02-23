import type { User } from "./user";

import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";
import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

import { Octokit } from "octokit";
const octokit = new Octokit();

// Login API Endpoint
// TODO: Add password authentication

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {

  
  const { username } = await req.body;
  try {
    // User Validation
    // Don't know if all user data or just user email is needed here.

    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) { // admin error, need to make sure this isn't displayed to user
      throw new Error(
        "Missing MongoDB connection string (MONGO_URI) in .env.local"
      );
    }
    
    const client = new MongoClient(mongoURI);
    const userCollection = client.db("sciren").collection("users");
    const userCursor = await userCollection // TODO: Check if toArray() can be checked for no results 
    .find({   // Filter
      email: username 
    }, {      // Projection
      limit: 1,
      projection: {
        _id: 0,           // Hide mongo assigned ID from query
        firstname: 1,
        lastname: 1,
        email: 1
      },
    });
    const userDocNext = await userCursor.next();
    const multipleMatches = await userCursor.hasNext()
    if (userDocNext == null) {
      throw new Error(
        "No user associated with the provided email."
      )
    } else if (multipleMatches) {
      throw new Error(
        "Multiple users found for provided email. This is a bug, contact site administrator."
      )
    }
    console.log("Cursor obtained: ")
    console.log(userDocNext)
    console.log("--------")
    

    const login = userDocNext.email;
    // Save retrieved user
    console.log("api/login : Completed profile retrieval for " + username);
    const user = { isLoggedIn: true, email: login} as User;
    req.session.user = user;
    await req.session.save();
    res.json(user);
  } catch (error) {
    // Respond with error
    res.status(500).json({ message: (error as Error).message});
  }
}
