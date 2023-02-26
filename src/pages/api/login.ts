import type { User } from "./user";

import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";
import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

// Login API Endpoint

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {

  
  const { email, password } = await req.body;
  try {
    // User Validation
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {    // admin error, need to make sure this isn't displayed to user
      throw new Error(
        "Missing MongoDB connection string (MONGO_URI). Update server parameters."
      );
    }
    const client = new MongoClient(mongoURI);
    const userCollection = client.db("sciren").collection("users");
    const userCursor = await userCollection 
    .find({   // Filter
      email: email 
    }, {      // Projection
      limit: 1,
      projection: {
        _id: 1,
        firstname: 1,     
        lastname: 1,
        email: 1,
        password: 1,
        usertype: 1,
      },
    });
    const userDoc = await userCursor.next();
    const multipleMatches = await userCursor.hasNext()
    if (userDoc == null) {
      throw new Error(
        "No user associated with the provided email."
      )
    } else if (multipleMatches) {
      throw new Error(
        "Multiple users found for provided email. This is a bug, contact site administrator."
      )
    }
    // Password validation 
    // Replace with assertion?
    if (userDoc.password != password) {
      throw new Error(
        "Username / Password mismatch. Please try again."
      )
    }

    console.log("api/login : Completed profile retrieval for " + email);
    
    // Save retrieved user    
    const user = { 
      isLoggedIn: true, 
      email: userDoc.email,
      password: userDoc.password,
      firstName: userDoc.firstname,
      lastName: userDoc.lastname,
      userType: userDoc.usertype,
      userID: userDoc._id.toString(),
    } as User;
    req.session.user = user;
    await req.session.save();
    res.json(user);
  } catch (error) {
    // Respond with error
    res.status(500).json({ message: (error as Error).message});
  }
}
