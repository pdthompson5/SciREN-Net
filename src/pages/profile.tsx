import React from "react";
import Head from 'next/head';
import Link from "next/link";
import Image from 'next/image';
import fetchJson from "@/lib/fetchJson";
import { useRouter } from 'next/router';
import useUser from "@/lib/useUser";

import styles from '@/styles/Profile.module.css'

/* Signed-in user's Profile Page */
// May implement User type checking

const Profile: React.FC = () => {
  const { user, mutateUser } = useUser({
    redirectTo: "/login",
  });
  const router = useRouter();
  
  if (!user) {
    console.error("No user found!");
    return null
  }

  // State-related code will go here.
  return (
    <>
      <Head>
        <title>Your SciREN Profile</title>
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
          {user.firstName} {user.lastName}
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
            <li>Profile Type: {user.userType}</li>
            <li>UserID: {user.userID}</li>
            <li>Contact: {user.email}</li>        
          </ul>
        </div>
      </div>
    </>
  )
}

export default Profile;