import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";

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

export type ErrorResponse = {
  message: string;
};

export type GetUserResponse = Omit<User, "password"> & { isLoggedIn: boolean };

export default withIronSessionApiRoute(getUser, sessionOptions);

async function getUser(
  req: NextApiRequest,
  res: NextApiResponse<GetUserResponse>
) {
  // This is triggered when we need data from the user
  if(req.method === "GET"){
    if (!req.session.user) {
      console.error("No user found.");
      // TODO: Figure out if we want to keep this as a 200
      res.status(200).json(EmptyUserResponse);
      return;
    }

    res.status(200).json({
      ...req.session.user,
      isLoggedIn: true,
    });
  }
  if(req.method === "POST") {
    req.session.user = JSON.parse(req.body);
    console.log(req.body);

    res.status(200).json({
      ...req.body.user,
      isLoggedIn: true,
    });
    console.log("Here")
    return;
  }
}
