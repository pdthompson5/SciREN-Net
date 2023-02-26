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

  
  const { email, password } = await req.body;
  try {
    // User Validation
    // Don't know if all user data or just user email is needed here.

    console.log("Running authentication with the following credentials: ")
    console.log(email)
    console.log(password)
    console.log("--------")

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
      email: email 
    }, {      // Projection
      limit: 1,
      projection: {
        _id: 1,           // Hide mongo assigned ID from query
        firstname: 1,
        lastname: 1,
        email: 1,
        password: 1,
        usertype: 1,
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
    // Password validation 
    // TODO: Replace with assertion?
    if (userDocNext.password != password) {
      throw new Error(
        "Username / Password mismatch. Please try again."
      )
    }

    console.log("Cursor obtained..........: ")
    console.log(userDocNext)
    console.log("--------")
    console.log("api/login : Completed profile retrieval for " + email);
    
    // Save retrieved user
    
    const user = { 
      isLoggedIn: true, 
      email: userDocNext.email,
      password: userDocNext.password,
      firstName: userDocNext.firstname,
      lastName: userDocNext.lastname,
      userType: userDocNext.usertype,
      userID: userDocNext._id.toString(),
    } as User;
    req.session.user = user;
    await req.session.save();
    res.json(user);
  } catch (error) {
    // Respond with error
    res.status(500).json({ message: (error as Error).message});
  }
}
