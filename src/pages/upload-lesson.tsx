import AWS from "aws-sdk";
import Image from "next/image";
import { useState } from "react";
import { uploadToS3 } from "@/lib/s3tools";
import fetchJson from "@/lib/fetchJson";
import AwsUploader from "@/components/AwsUploader";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-2",
  signatureVersion: "v4",
});

export default function ImageUploader() {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<File | undefined>(undefined); // <--- typing this makes it fail
  const handleFileSelect = (e: any) => {
    setFile(e.target.files[0]);
  };
  const handleUploadClick = async () => {
    console.log("CLIENT: uploading the following file...");
    console.log(file?.constructor.name);
    const fileData = new FormData();
    fileData.append("file", file as Blob);
    // bytestream will scale better than buffer
    const fileBytes = await file?.arrayBuffer();
    const fileStream = await file?.stream();
    const Location = fetch("/api/awsFile", {
      method: "POST",
      headers: { "Content-Type": "application/octet-stream" },
      body: fileData,
    });
    if (Location == undefined) {
      console.log("Error uploading to S3");
      return;
    }
    console.log("UPLOADED URL: ", Location);
    // setImageUrl(uploadedUrl as string);
  };

  return (
    <div>
      <div style={{ marginTop: "150px" }}>
        <h1>Test Image Upload</h1>
        <input type="file" onChange={handleFileSelect} />
        {file && (
          <div style={{ marginTop: "10px" }}>
            <button onClick={handleUploadClick}>Upload</button>
          </div>
        )}
        {imageUrl && (
          <div style={{ marginTop: "10px" }}>
            <Image src={imageUrl} alt="uploaded" />
          </div>
        )}
      </div>
    </div>
  );
}
