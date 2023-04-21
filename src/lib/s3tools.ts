import AWS from "aws-sdk";
import Image from "next/image";
import React, { useState } from "react";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-2",
  signatureVersion: "v4",
});

export const uploadToS3 = async (file: File | undefined) => {
  const s3 = new AWS.S3();
  console.log("uploading the following file...");
  console.log(file);
  if (file == undefined) {
    console.log("No file selected!");
    return;
  }
  const params = {
    Bucket: "sciren",
    Key: `${Date.now()}.${(file as File).name}`,
    Body: file,
  };
  const { Location } = await s3.upload(params).promise();
  console.log("uploading to s3: ", Location);
  return Location;
};

// export default function ImageUploader() {
//   const s3 = new AWS.S3();
//   const [imageUrl, setImageUrl] = useState("");
//   const [file, setFile] = useState<File | undefined>(undefined); // <--- typing this makes it fail

//   const handleFileSelect = (e: any) => {
//     setFile(e.target.files[0]);
//   };
//   const uploadToS3 = async () => {
//     console.log("uploading the following file...");
//     console.log(file);
//     if (!file) {
//       console.log("No file selected");
//       return;
//     }

//     const params = {
//       Bucket: "sciren",
//       Key: `${Date.now()}.${(file as File).name}`,
//       Body: file,
//     };
//     const { Location } = await s3.upload(params).promise();
//     setImageUrl(Location);
//     console.log("uploading to s3: ", Location);
//   };
//   return (
//     <div style={{ marginTop: "150px" }}>
//       <h1>Test Image Upload</h1>
//       <input type="file" onChange={handleFileSelect} />
//       {file && (
//         <div style={{ marginTop: "10px" }}>
//           <button onClick={uploadToS3}>Upload</button>
//         </div>
//       )}
//       {imageUrl && (
//         <div style={{ marginTop: "10px" }}>
//           <Image src={imageUrl} alt="uploaded" />
//         </div>
//       )}
//     </div>
//   );
// }
