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

export const gradeRangeOptions = ["Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"]
export const academicInterestOptions = ["mathematics", "biology", "chemistry", "social studies", "history", "sociology"];
export const userTypes = ["researcher", "teacher", "student", "admin"]

export default async function postUser(
  req: NextApiRequest,
  res: NextApiResponse<PostUserResponse>
) {
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
