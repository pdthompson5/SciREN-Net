import AWS from "aws-sdk";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-2",
  signatureVersion: "v4",
});

interface PostLessonResponse {
  location: string;
}

export default async function uploadToS3(
  req: NextApiRequest, // maybe type this with file: File
  res: NextApiResponse<PostLessonResponse>
) {
  console.log("Reached api call...");
  const s3 = new AWS.S3();
  const reqBody = await req.body;

  // const fileObj = new File(reqBody, "temp_filename", {
  //   type: "mimeType",
  // });
  console.log("reqBody 1: ", reqBody.constructor.name);
  // console.log(reqBody);
  console.log("--------------------");
  // const parsedFile = new File(reqBody, "temp_filename");
  // console.log(parsedFile);

  // console.log("SERVER: uploading the following file...");
  // console.log(file);
  // if (file == undefined) {
  //   console.log("SERVER: No file selected!");
  //   return res.status(400).json({ location: "None" });
  // }
  // const params = {
  //   Bucket: "sciren",
  //   Key: `${Date.now()}.${(file as File).name}`,
  //   Body: file,
  // };
  // const { Location } = await s3.upload(params).promise();
  // console.log("SERVER: uploading to s3: ", Location);
  return res.status(200); //.json({ location: Location });
}

// export default async function uploadToS3(
//     file: File | undefined
//   ): Promise<string | undefined> {
//     const s3 = new AWS.S3();
//     console.log("uploading the following file...");
//     console.log(file);
//     if (file == undefined) {
//       console.log("No file selected!");
//       return undefined;
//     }
//     const params = {
//       Bucket: "sciren",
//       Key: `${Date.now()}.${(file as File).name}`,
//       Body: file,
//     };
//     const { Location } = await s3.upload(params).promise();
//     console.log("uploading to s3: ", Location);
//     return Location;
//   }
