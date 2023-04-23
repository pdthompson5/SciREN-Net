import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import useUser from "@/lib/useUser";
import fetchJson from "@/lib/fetchJson";
import { useRouter} from "next/router";
import {
  ProfileInformation,
  getAllUserIDs,
  getProfileInformation,
} from "@/lib/database";
import { GetStaticPropsContext } from "next";
import styles from "@/styles/Profile.module.css";
import { Button } from "@mui/material";

const UserProfile: React.FC<ProfileInformation> = (
  props: ProfileInformation
) => {
  const { user, mutateUser } = useUser();
  const router = useRouter();
  const title = `${props.firstName} ${props.lastName} | SciREN-Net`;
  const isCurrentUser = user && user.isLoggedIn && user.email === props.email;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="" />
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
        </h1>

        <div>
          <ul>
            <li>Profile Type: {props.userType}</li>
            <li>UserID: {props.userID}</li>
            {(user && user.isLoggedIn) && 
            <li>
              <Link href={`/contact?user=${props.userID}`} passHref>
                <Button variant="contained" color="primary">Contact User</Button>
              </Link>
            </li>}
          </ul>
        </div>
        <Button
          variant="contained"
          onClick={async (e) => {
            e.preventDefault();
            fetch(`/api/user?userID=${user?.userID}`, { method: "DELETE" }), false;
            console.log("test")
            mutateUser(await fetchJson("/api/logout", { method: "POST" }), false);
            router.replace("/login");
          }}
          className={styles.deleteUser}
          type="submit"
        >
          Delete User
        </Button>
      </div>
    </>
  );
};

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
