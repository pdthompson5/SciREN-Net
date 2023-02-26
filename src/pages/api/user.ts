import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";
import { NextApiRequest, NextApiResponse } from "next";

export type User = {
  isLoggedIn: boolean;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: string;
  userID: string;
};

export default withIronSessionApiRoute(userRoute, sessionOptions);

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  // This is triggered when we need data from the user
  if (req.session.user) {
    console.log("api/user : reg.session.user == True, ");
    
    // From OG author 'vvo':
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    
    res.json({
      ...req.session.user,
      isLoggedIn: true,
    });
  } else {
    res.json({  // Empty object to satisfy interface
      isLoggedIn: false,
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      userType: "",
      userID: "",
    });
  }
}