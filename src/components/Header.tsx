import React from "react";
import styles from "@/styles/Header.module.css";
import Link from "next/link";
import useUser from "@/lib/useUser";
import Sticky from "react-stickynode";
import fetchJson from "@/lib/fetchJson";
import { useRouter, NextRouter } from "next/router";
import { GetUserResponse } from "@/pages/api/userSession";
import { KeyedMutator } from "swr";

const Header: React.FC = () => {
  const { user, mutateUser } = useUser();
  const router = useRouter();
  console.log(process.env)
  return (
    <>
      <Sticky enabled={true}>
        <div className={styles.header}>
          <Link href="/" className={styles.headerElement}>
            SciRenNet
          </Link>
          {user?.isLoggedIn
            ? logged_in_header_elements(user, router, mutateUser)
            : logged_out_header_elements()}
        </div>
      </Sticky>
    </>
  );
};

const logged_in_header_elements = (
  user: GetUserResponse,
  router: NextRouter,
  mutateUser: KeyedMutator<GetUserResponse>
) => {
  return [
    <Link href="/lessons" className={styles.headerElement} key="login">
      Lesson Plans
    </Link>,
    <Link
      href={`/profiles/${user.userID}`}
      className={styles.headerElement}
      key="my-profile"
    >
      My Profile
    </Link>,
    <Link
      href="/api/logout"
      key="logout"
      onClick={async (e) => {
        e.preventDefault();
        mutateUser(await fetchJson("/api/logout", { method: "POST" }), false);
        router.replace("/login");
      }}
    >
      Logout
    </Link>,
  ];
};

const logged_out_header_elements = () => {
  return [
    <Link href="/login" className={styles.headerElement} key="login">
      Sign-in
    </Link>,

    <Link href="/register" className={styles.headerElement} key="register">
      Sign-up
    </Link>,
  ];
};

export default Header;
