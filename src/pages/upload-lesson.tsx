import AWS from "aws-sdk";
import Image from "next/image";
import { useState } from "react";
import { uploadToS3 } from "@/lib/s3tools";
import fetchJson from "@/lib/fetchJson";
import AwsUploader from "@/components/AwsUploader";

export default function ImageUploader() {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<File | undefined>(undefined); // <--- typing this makes it fail
  const handleFileSelect = (e: any) => {
    setFile(e.target.files[0]);
  };
  const handleUploadClick = async () => {
    console.log("CLIENT: uploading the following file...");
    console.log(file);
    // bytestream will scale better than buffer
    const fileBytes = await file?.arrayBuffer();
    const uploadedUrl = fetch("/api/awsFile", {
      method: "POST",
      headers: { "Content-Type": "application/octet-stream" },
      body: file,
    });
    if (uploadedUrl == undefined) {
      console.log("Error uploading to S3");
      return;
    }
    console.log("UPLOADED URL: ", uploadedUrl);
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
