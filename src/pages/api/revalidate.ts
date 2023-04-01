import { NextApiRequest, NextApiResponse } from "next";

export interface RevalidationRequest{
    path: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.query.secret !== process.env.REVALIDATION_TOKEN) {
        return res.status(401).json({ message: 'Invalid token' })
    }
    const { path }: RevalidationRequest = await req.body;

    try {
        await res.revalidate(path)
        return res.json({ revalidated: true })
    } catch (err) {
        return res.status(500).send('Error revalidating')
    }
}
