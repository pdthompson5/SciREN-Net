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
import { Avatar, Box, Button, Divider, Stack, capitalize } from "@mui/material";

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
          <Stack direction="row" spacing={1} alignItems="center">
            {getAvatar(props.firstName, props.lastName)}
            <h1 className="username"> {props.firstName} {props.lastName} </h1>
            {isCurrentUser && editButton()}
          </Stack>
          <Divider></Divider>
          <h3 className={styles.profileHeading}>
              {capitalize(props.userType)}  
              {props.organizations.length > 0 ? ` at ${props.organizations[0]}`: ""}
          </h3>
          <h3 className={styles.profileHeading}>
            Region: {props.scirenRegion}  
          </h3>

          <h3 className={styles.profileHeading}>About</h3>
          <Divider></Divider>
          <p className={styles.textBio}>
            {props.textBio}
          </p>

          <h3 className={styles.profileHeading}>{props.userType === "teacher" ? "Subjects Taught" : "Research Areas"}</h3>
          <Divider></Divider>
          {commaSeparateList(props.academicInterest)}
          <h3 className={styles.profileHeading}>
            Affiliated Organization{multipleOrgs ? "s": ""}
            <Divider></Divider>
          </h3>
          {commaSeparateList(props.organizations)}
          <h3 className={styles.profileHeading}>Position{multipleOrgs ? "s": ""} at Organization{multipleOrgs ? "s": ""}</h3>
          <Divider></Divider>
          <p className={styles.profileParagraph}>{props.position}</p>
        </Box>

        <Box className={styles.profileElement}>
            <h3 className={styles.profileHeading}>Lesson Plans</h3>
            <Divider></Divider>
            <p className={styles.profileParagraph}>This is where the linked lesson plans will be</p>
            <h3 className={styles.profileHeading}>External Links</h3>
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



const commaSeparateList = (list: string[]) => {
  return (list.map(
    (val, i) => (
      <>
      {val}
      {i < list.length - 1 ? ", " : ""}
      </>
    ))
  )
}

const editButton = () => {
  return (
    <Link href="/edit-profile">
    <Image
      height="24"
      width="24"
      alt="Edit Profile"
      className="profile"
      src="/edit.svg"
    ></Image>
  </Link> 
  )
}

const getAvatar = (firstName: string, lastName: string) => {
  return (
    <Avatar  
      sx={{
        bgcolor: stringToColor(`${firstName} ${lastName}`),
        height: "50px",
        width: "50px"
    }}
    >
      {`${firstName[0]}${lastName[0]}`}
    </Avatar>
  )
}

// Generate arbitrary color based on name. Code from https://mui.com/material-ui/react-avatar/
const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
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
