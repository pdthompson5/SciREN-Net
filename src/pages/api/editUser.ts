import { NextApiRequest, NextApiResponse } from "next";
import { establishMongoConnection, getUserCollection } from "@/lib/database";
import { PostUserRequest, PostUserResponse } from "./user";

type PostUserRequestWithID = PostUserRequest & { userID: string };
export default async function postEditUser(
  req: NextApiRequest,
  res: NextApiResponse<PostUserResponse>
) {
  const reqBody: PostUserRequestWithID = await JSON.parse(req.body);
  const mclient = await establishMongoConnection();
  const userCollection = getUserCollection(mclient);

  if (
    (await userCollection.countDocuments({
      email: reqBody.email,
    })) < 1
  ) {
    console.log(
      await userCollection.countDocuments({
        email: reqBody.email,
      })
    );
    res.status(404).json({
      message: "User not found with given email.",
    });
    return;
  }

  const { userID, ...reqWithoutUserID } = reqBody;

  await userCollection
    .updateOne({ email: reqBody.email }, { $set: reqWithoutUserID })
    .then(() =>
      res.revalidate(`/profiles/${reqBody.userID}`).then(() => {
        console.log("api/editUser : edited user successfully");
        res.status(200).json({
          message: "Successfully updated user.",
        });
      })
    );
  res.revalidate("/profile-search");
}
