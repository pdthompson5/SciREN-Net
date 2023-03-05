import React from "react";
import Head from 'next/head'
import Image from 'next/image'

import { GetServerSideProps } from "next";
import { Inter } from '@next/font/google'
import styles from '@/styles/Profile.module.css'
import { MongoClient } from "mongodb";
import { getUser } from "@/lib/database";

const Profile: React.FC = () => {


    console.log(getUser("00-0000-0003"))
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
