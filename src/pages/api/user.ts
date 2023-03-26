import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, WithId } from "mongodb";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";

export interface PostUserResponse {
  message: string;
}

export const EmptyUserResponse: GetUserResponse = {
  isLoggedIn: false,
  email: "",
  firstName: "",
  lastName: "",
  userType: "",
  userID: "",
  joinDate: "", // ISO string always
  academicInterest: [],
  gradeRange: [],
};

export interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: string;
  userID: string;
  joinDate: string; // ISO string always
  academicInterest: Array<string>;
  gradeRange: Array<number>;
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

export type ErrorResponse = {
  message: string;
};

export type GetUserResponse = Omit<User, "password"> & { isLoggedIn: boolean };

async function getUser(
  req: NextApiRequest,
  res: NextApiResponse<GetUserResponse>
) {
  // This is triggered when we need data from the user
  if (!req.session.user) {
    console.error("No user found.");
    res.status(404).json(EmptyUserResponse);
    return;
  }

  res.status(200).json({
    ...req.session.user,
    isLoggedIn: true,
  });
}

const connectMongo = () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }
  const mongoDB = process.env.DB_NAME;
  if (!mongoDB) {
    throw new Error(
      "Please define the DB_NAME environment variable inside .env.local"
    );
  }

  return new MongoClient(mongoURI);
};

async function postUser(
  req: NextApiRequest,
  res: NextApiResponse<PostUserResponse>
) {
  const reqBody: PostUserRequest = JSON.parse(await req.body);
  const mclient = connectMongo();
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  
  switch (req.method) {
    case "POST":
      // posting user to database requires no session, only used in registration
      postUser(req, res);
      break;
    case "GET":
      withIronSessionApiRoute(getUser, sessionOptions);
      break;
    default:
      res
        .status(405)
        .json({ message: "Method not allowed", method: req.method });
  }
}
