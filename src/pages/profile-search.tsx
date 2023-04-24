import React, { useEffect, useState } from "react";
import Head from "next/head";
import { GetStaticProps, GetStaticPropsContext } from "next";
import { Lesson, Profile, getProfiles } from "@/lib/database";
import styles from "@/styles/List.module.css";
import Button from "@mui/material/Button";
import useUser from "@/lib/useUser";
import { gradeRangeOptions } from "./edit-profile";
import { GetUserResponse } from "./api/userSession";
import { capitalize } from "@mui/material";
import Link from "next/link";

interface ProfileListProps {
  profiles: Profile[];
  undefined: boolean;
}

const ProfileList: React.FC<ProfileListProps> = (props: ProfileListProps) => {
  const { user} = useUser(
    (user: GetUserResponse) => "/login"
  );
  return (
    <>
      <Head>
        <title>Profile Search - SciREN</title>
        <meta name="description" content="SciREN Profile List" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {user && user.isLoggedIn ? 
        <main className={styles.mainContainer}>
          <h1 className={styles.listTitle}>SciREN Profiles</h1>
          <ProfileFragment profiles={props.profiles} />
          <Footer />
        </main>:
        <h1>Loading...</h1>
      }
    </>
  );
};

const Footer: React.FC = () => {
  return (
    <>
      <div className={styles.lessonFooter}>
        <text>
          For more information on lesson plans, contact your region&apos;s
          SciREN Organization.
        </text>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const profiles: Profile[] | undefined = await getProfiles()
  const notFound = !profiles;
  return { props: { profiles: profiles, notFound } };
};

const ProfileCard: React.FC<Profile> = (profile: Profile) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  return (
    <div>
      <div className={styles.lessonContainer}>
        <h2 className="lessonTitle">
          {profile.firstName} {profile.lastName}
        </h2>
        <h3>
            {capitalize(profile.userType)} {profile.organizations.length > 0 && `at ${profile.organizations[0]}`}
        </h3>

        <hr className={styles.divider} />
        <div
          onMouseEnter={() => setIsCollapsed(false)}
          onMouseLeave={() => setIsCollapsed(true)}
          className={`${styles.lessonAbstract} ${
            isCollapsed ? styles.lessonAbstractCollapsed : ""
          }`}
        >
          {profile.textBio}
        </div>

        {/* <div className={styles.gradeBox}>
          <p className={styles.categoryText}>
            Research Areas: {lesson.gradeLevel.map((gi) => gradeRangeOptions[gi]).join(", ")}
          </p>
          <p className={styles.categoryText}>Subject: {lesson.subject}</p>
        </div> */}

        <div className={styles.linkContainer}>
          <Link href={`/profiles/${profile.userID}`} passHref>
            <Button variant="contained">View Profile</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const ProfileFragment: React.FC<{
  profiles: Profile[];
}> = (props) => {
  return (
    <>
      {
        // Wrapped in a fragment to satisfy type checks
        props.profiles.map((profile: Profile) => (
          <ProfileCard key={profile.userID} {...profile} />
        ))
      }
    </>
  );
};

export default ProfileList;
