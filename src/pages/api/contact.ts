import { NextApiRequest, NextApiResponse } from "next";
import { GetUserResponse } from "./userSession";

export interface ContactRequest{
    contactingUser: GetUserResponse,
    contactedUserEmail: string,
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // if (req.query.secret !== process.env.REVALIDATION_TOKEN) {
    //     return res.status(401).json({ message: 'Invalid token' })
    // }
    const request: ContactRequest = await JSON.parse(req.body);
    console.log(request)

    return res.status(200)

}
