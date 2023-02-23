import React from "react";
import Head from 'next/head';
import Link from "next/link";
import Image from 'next/image';
import fetchJson, { FetchError } from "@/lib/fetchJson";

import { useRouter } from 'next/router';
import useUser from "@/lib/useUser";


import { GetServerSideProps } from "next";
import { Inter } from '@next/font/google'
import styles from '@/styles/Profile.module.css'
import { MongoClient } from "mongodb";

/* Placeholder Profile Page
Skeleton of a profile page to re-learn tsx + css. 
I added some notes below for the boys for creating a simple page and 

Next.js does some fancy routing in the compilation of the website, 
making it easier to create and organize pages.

To create a new page, just add a {pagename}.tsx file under '.src/pages/' 
and create a default export like below.

*/
interface Props {
  userID: string;
  firstName: string;
  lastName: string;
  email: string,
  userType: string
}


export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
 

  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  const mongoDB = process.env.DB_NAME;
  if (!mongoDB) {
    throw new Error(
      "Please define the MONGODB_DB environment variable inside .env.local"
    );
  }

  // Establish Mongo
  // const client = await MongoClient.connect(mongoURI);
  const client = new MongoClient(mongoURI);

  const collection = client.db(mongoDB).collection("users");
  console.log("Connected to MongoDB.");

  // Close mongoDB
  client.close();

   
  const userProps = {
    userID: "PLACEHOLDER_ID",
    firstName: "John",
    lastName: "Smith",
    email: "jsmith@sciren.net",
    userType: "Researcher"
  }

  return { props: userProps };
};

const Profile: React.FC<Props> = (props) => {
  const { user, mutateUser } = useUser();
  const router = useRouter();

  // State-related code will go here.
  return (
    <>
      <Head>
        <title>SciREN Profile Example</title>
        <meta name="description" content="Created by Stephen Kirby" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.profileBox}>
        <h1 className="username">
          <Image
            height="36"
            width="36"
            alt="Profile Picture"
            className="profile"
            src="https://github.com/s-kirby.png"
          />
          {props.firstName} {props.lastName}
        </h1>
        <Link href="/api/logout"
          onClick={async (e) => {
            e.preventDefault();
            mutateUser(
              await fetchJson("/api/logout", { method: "POST" }),
              false,
            );
            router.push("/login");
          }}
        >
          Logout
        </Link>
        <div>
          <ul>
            <li>Profile Type: {props.userType}</li>
            <li>UserID: {props.userID}</li>
            <li>Contact: {props.email}</li>        
          </ul>
        </div>
      </div>
    </>
  )
}

export default Profile;