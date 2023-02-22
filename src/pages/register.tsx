import React from "react";
import Head from 'next/head'
import Image from 'next/image'

import { GetServerSideProps } from "next";
import { Inter } from '@next/font/google'
import styles from '@/styles/Profile.module.css'
import { MongoClient } from "mongodb";

/*
Created by Stephen on 02/16/23
Registration Page, Users should be directed here from landing page, sign-in page. 

*/
interface Props {
  updatedID: string,
}


export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
 

  const updatedProps = {
    updatedID: "",
  }

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

  
  return { props: updatedProps };
};

const Profile: React.FC<Props> = (props) => {

  // State-related code will go here.
  return (
    <>
      <Head>
        <title>SciREN: Sign-up</title>
        <meta name="description" content="SciREN Profile Signup" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Signup</h1>
    </>
  )
}

export default Profile;