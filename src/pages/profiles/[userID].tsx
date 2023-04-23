import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import useUser from "@/lib/useUser";
import {
  ProfileInformation,
  getAllUserIDs,
  getProfileInformation,
} from "@/lib/database";
import { GetStaticPropsContext } from "next";
import styles from "@/styles/Profile.module.css";
import { Box, Button, Divider, List, ListItem, capitalize } from "@mui/material";

const UserProfile: React.FC<ProfileInformation> = (
  props: ProfileInformation
) => {
  const { user } = useUser();

  const title = `${props.firstName} ${props.lastName} | SciREN-Net`;
  const isCurrentUser = user && user.isLoggedIn && user.email === props.email;
  const multipleOrgs = props.organizations.length > 1;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <div className={styles.profileBox}>
        <Box className={styles.profileElement}>
          <h1 className="username">
            <Image
              height="36"
              width="36"
              alt="Profile Picture"
              className="profile"
              src="https://github.com/s-kirby.png"
            />
            {props.firstName} {props.lastName}
            {isCurrentUser && (
              <Link href="/edit-profile">
                <Image
                  height="24"
                  width="24"
                  alt="Edit Profile"
                  className="profile"
                  src="/edit.svg"
                ></Image>
              </Link>  
            )}
            <Divider></Divider>
          </h1>
          <h3>
              {capitalize(props.userType)}  
              {props.organizations.length > 0 ? ` at ${props.organizations[0]}`: ""}
          </h3>
          <h3>
            Region: {props.scirenRegion}  
          </h3>
        </Box>

        <Box className={styles.profileElement}>
            <h3>About</h3>
            <Divider></Divider>
            <p className={styles.textBio}>
              {props.textBio}
            </p>
        </Box>

        <Box className={styles.profileElement}>
          <h3>{props.userType === "teacher" ? "Subjects Taught" : "Research Areas"}</h3>
          <Divider></Divider>
          <List>
            {getAcademicInterestElements(props.academicInterest)}
          </List>
        </Box>

        <Box className={styles.profileElement}>
          <h3>
            Affiliated Organization{multipleOrgs ? "s": ""}
            <Divider></Divider>
          </h3>
          <List>
            {props.organizations.map(
              (value, index) => (
                <ListItem key={`organizations-${index}`} disableGutters>
                  {value}
                </ListItem>
              ))
            }
          </List>
          <h3>Position{multipleOrgs ? "s": ""} at Organization{multipleOrgs ? "s": ""}</h3>
          <Divider></Divider>
          <p className={styles.profileParagraph}>{props.position}</p>
        </Box>

        <Box className={styles.profileElement}>
            <h3>Lesson Plans</h3>
            <Divider></Divider>
            <p className={styles.profileParagraph}>This is where the linked lesson plans will be</p>
        </Box>
        <Box className={styles.profileElement}>
            <h3>External Links</h3>
            <p className={styles.profileParagraph}>This is where external links will go once that is implemented</p>
        </Box>

        {(user && user.isLoggedIn) &&               
          <Link href={`/contact?user=${props.userID}`} passHref>
            <Button variant="contained">Contact User</Button>
          </Link>
        }
      </div>
    </>
  );
};

const getAcademicInterestElements = (academicInterest: string[]) => {
  return academicInterest.map(
    (value, index) => (
      <ListItem disableGutters key={`academic-interest-${index}`}>
        {value}
      </ListItem>
    )
  )
}

//Return props for each page
export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<{
  userID: string;
}>) => {
  const { userID } = params as { userID: string };
  const user = await getProfileInformation(userID).catch((reason) => {console.log(reason); return undefined});
  const notFound = !user;
  return { props: user, notFound };
};

//Return all paths
export const getStaticPaths = async () => {
  const ids: string[] = await getAllUserIDs();

  const params = ids.map((id) => ({
    params: {
      userID: id,
    },
  }));

  return { paths: params, fallback: "blocking" };
};

export default UserProfile;
