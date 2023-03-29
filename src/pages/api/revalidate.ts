import { NextApiRequest, NextApiResponse } from "next";

export interface RevalidationRequest{
    path: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("HERE")
    if (req.query.secret !== process.env.REVALIDATION_TOKEN) {
        return res.status(401).json({ message: 'Invalid token' })
    }
    console.log(await req.body)
    const { path }: RevalidationRequest = await JSON.parse(req.body);
    console.log(path)

    try {
        await res.revalidate(path)
        return res.json({ revalidated: true })
    } catch (err) {
        console.log(err)
        return res.status(500).send('Error revalidating')
    }
}
