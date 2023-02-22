import type { User } from "./user";

import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";
import { NextApiRequest, NextApiResponse } from "next";

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { username } = await req.body;

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
    // Original user validation
    // const {
    //   data: { login, avatar_url },
    // } = await octokit.rest.users.getByUsername({ username });


    const user = { isLoggedIn: true, userId: "NoUserId_login.ts"} as User;
    req.session.user = user;
    await req.session.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}
