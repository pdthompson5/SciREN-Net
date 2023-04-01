import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/pages/api/userSession";
import { establishMongoConnection } from "@/lib/database";
import postUser, { PostUserRequest, PostUserResponse } from "./user";
import { UserWithID } from "@/lib/database";


type PostUserRequestWithID = PostUserRequest & {userID: string}
export default async function postEditUser(
  req: NextApiRequest,
  res: NextApiResponse<PostUserResponse>
) {
    console.log((await req.body).type)
    const reqBody: PostUserRequestWithID = await JSON.parse(req.body);
    const mclient = await establishMongoConnection();
    const userCollection = mclient.db("sciren").collection("users");
    console.log(reqBody)

    console.log("email")
    console.log(reqBody.email)
    // TODO: This seems inefficient 
    if (
        (await userCollection.countDocuments({
        email: reqBody.email,
        })) < 1
    ) {
        console.log((await userCollection.countDocuments({
            email: reqBody.email,
            })))
        res.status(404).json({
        message: "User not found with given email.",
        });
        return;
    }

    const { userID, ...reqWithoutUserID }= reqBody;
    
    userCollection.updateOne(
        {email: reqBody.email},
        {$set: reqWithoutUserID}
    )

    // TODO: There is probably a better way to get _id
    // userCollection.findOne({email: reqBody.email})

    // const userInfoCursor = userCollection.findOne({ email: reqBody.email }, {});
    // const userInfo = (await userInfoCursor) as UserWithID;


    await res.revalidate(`/profiles/${reqBody.userID}`)


    // const resp = await fetch(`/api/revalidate?secret=${process.env.REVALIDATION_TOKEN}`, {
    //     method: "POST",
    //     body: JSON.stringify({
    //         path: `/profiles/${userInfo._id}`
    //     }),
    // });
    
    console.log("api/editUser : edited user successfully");
        res.status(200).json({
            message: "Successfully updated user.",
        });
}
