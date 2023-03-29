import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/pages/api/userSession";
import { establishMongoConnection } from "@/lib/database";

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


export default async function postUser(
  req: NextApiRequest,
  res: NextApiResponse<PostUserResponse>
) {
  // TODO: How is this working is req.body is an object rather than json text?
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
}
