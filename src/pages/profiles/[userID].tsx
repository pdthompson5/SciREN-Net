import React from "react";
import Head from 'next/head'
import Link from "next/link";
import Image from 'next/image';
import { ProfileInformation, getAllUserIDs, getProfileInformation, getUser } from "@/lib/database";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import styles from '@/styles/Profile.module.css'


//TODO: Do we want to share this profile with /profile?
const UserProfile: React.FC<ProfileInformation> = (props: ProfileInformation) => {
  const title = `${props.firstName} ${props.lastName} SciREN Profile`
  return (
    <>
      <Head>
        <title>{title}</title>
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

//Return props for each page
export const getStaticProps = async ({ params }: GetStaticPropsContext<{
    userID: string
}>) => {
  const { userID } = params as { userID: string };
  const user = await getProfileInformation(userID)
  return {props: user}
}

//Return all paths
export const getStaticPaths = async () => {
    const ids = await getAllUserIDs()
    const params = ids.map((id) => ({
      params: {
        userID: id
      }
    }))
    //TODO: Determine how to use profile-not-found page for fallback
    return { paths: params, fallback: false }
}


export default UserProfile;
