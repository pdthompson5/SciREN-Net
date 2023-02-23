import type { User } from "./user";

import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";
import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

import { Octokit } from "octokit";
const octokit = new Octokit();

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { email } = await req.body;

  try {
    // User validation here
    // Not sure if we load the full user here or just the ID yet.
    // If we just load the ID, props will probably need to be retrieved in api/user.
    // Here, we only need to get the user ID
    
    // Possible strategy: 
    // Only check uname/password here, add userid to returned JSON
    // In api/user.ts, finish DB requests. 
    
    // Possible Strategy 2: 
    // Get everything here. 

    // DESIRED Login 
    // const mongoURI = process.env.MONGO_URI;
    // if (!mongoURI) { // admin error, need to make sure this isn't displayed to user
    //   throw new Error(
    //     "Missing MongoDB connection string (MONGO_URI) in .env.local"
    //   );
    // }
    
    // const client = new MongoClient(mongoURI);
    // const userCollection = client.db("sciren").collection("users");
    // const userCursor = await userCollection // TODO: Check if toArray() can be checked for no results 
    // .find({   // Filter
    //   email: { $eq: email } 
    // }, {      // Projection
    //   limit: 1,
    //   projection: {
    //     _id: 0,           // Hide mongo assigned ID from query
    //     firstName: 1,
    //     lastName: 1,
    //     email: 1
    //   },
    // });

    // const anyDocs = await userCursor.hasNext();
    // if (!anyDocs) {
    //   // No documents found
    //   throw new Error(
    //     "No user found from email!"
    //   )
    // }
    // const userArray = await userCursor.toArray();
    // const userDoc = userArray[0];
    const { username } = await req.body;

    const {
      data: { login, avatar_url },
    } = await octokit.rest.users.getByUsername({ username });
    console.log("api/login : Completed profile retrieval for " + username);

    // Save retrieved user
    const user = { isLoggedIn: true, email: login} as User;
    req.session.user = user;
    await req.session.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}
