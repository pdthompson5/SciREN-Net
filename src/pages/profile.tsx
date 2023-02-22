import Head from 'next/head'
import Image from 'next/image'

import { GetServerSideProps } from "next";
import { Inter } from '@next/font/google'
import styles from '@/styles/Profile.module.css'
import { MongoClient } from "mongodb";
// const { MongoClient, ServerApiVersion } = require('mongodb');

const inter = Inter({ subsets: ['cyrillic'] })

/*
Created by Stephen on 02/16/23
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
    email: "jsmith@sciren.net"
  }

  return { props: userProps };
};

export default function Profile() {
  return (
    <>
      <Head>
        <title>SciREN Profile Example</title>
        <meta name="description" content="Created by Stephen Kirby" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.topbar}>
          <h1>
            YOU SHOULD NOT BE HERE.
          </h1>
          <p>
            This is where we will display text stuff for the profile.
          </p>
        </div>
      </main>
    </>
  )
}
