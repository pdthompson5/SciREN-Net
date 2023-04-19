import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/pages/api/userSession";
import { establishMongoConnection, getMongoUser, getProfileInformation } from "@/lib/database";

export interface PostUserResponse {
  message: string;
}

export type PostUserRequest = Pick<
  User,
  | "email"
  | "password"
  | "userType"
  | "firstName"
  | "lastName"
  | "academicInterest"
  | "gradeRange"
>;

export type GetUserRequest = {
  userID: string
}

export default async function postUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method === "GET"){
    const idToFetch = req.query.userID
    if(idToFetch === undefined || Array.isArray(idToFetch)){
      return res.status(400)
    }
    const user = await getProfileInformation(idToFetch)

    return res.status(200).json(user);
  }

  if(req.method === "POST"){
    const reqBody: PostUserRequest = JSON.parse(await req.body);
    const mclient = await establishMongoConnection();
    const userCollection = mclient.db("sciren").collection("users");
    if (
      (await userCollection.countDocuments({
        email: reqBody.email,
      })) > 0
    ) {
      res.status(409).json({
        message: "User already exists with that email.",
      });
      return;
    }
  
  
    // Insert the new user, push profile page
    userCollection.insertOne({
      ...reqBody,
      joinDate: new Date(),
    });
    console.log("api/registerUser : added a new user successfully");
    res.status(200).json({
      message: "Successfully added user.",
    });
    return;
  }

  if(req.method === "DELETE"){
    const mclient = await establishMongoConnection();
    const userCollection = mclient.db("sciren").collection("users");
    const idToFetch = req.query.userID
    if(idToFetch === undefined || Array.isArray(idToFetch)){
      return res.status(400)
    }
    const user = await getProfileInformation(idToFetch)
    // delete user, push profile page
    userCollection.deleteOne({"_id": user});
    console.log("api/registerUser : deleted a user successfully");
    res.status(200).json({
      message: "Successfully deleted user.",
    });
    return;
  }
}
