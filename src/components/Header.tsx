import React from "react";
import styles from "@/styles/Header.module.css";
import Link from "next/link";
import useUser from "@/lib/useUser";
import Sticky from "react-stickynode";
import fetchJson from "@/lib/fetchJson";
import { useRouter, Router } from "next/router";
import { isClientSideUser } from "@/lib/useUser";

const Header: React.FC = () => {
  const { user, mutateUser } = useUser();
  const router = useRouter();
  const logoutButton = (
    <Link
      href="/api/logout"
      onClick={async (e) => {
        e.preventDefault();
        mutateUser(await fetchJson("/api/logout", { method: "POST" }), false);
        router.replace("/login");
      }}
    >
      Logout
    </Link>
  );

  const user_logged_in  = user ? 
      isClientSideUser(user) ? 
        user.isLoggedIn
      : false
    : false;

  return (
    <>
      <Sticky enabled={true}>
        <div className={styles.header}>
          <Link href="/" className={styles.headerElement}>
            SciRenNet
          </Link>
          {user?.isLoggedIn && (
            <Link
              href={`/profiles/${user.userID}`}
              className={styles.headerElement}
            >
              My Profile
            </Link>
          )}
          {user?.isLoggedIn && logoutButton}
          {!user?.isLoggedIn && (
            <Link href="/register" className={styles.headerElement}>
              Sign-up
            </Link>
          )}
          {!user?.isLoggedIn && (
            <Link href="/login" className={styles.headerElement}>
              Sign-in
            </Link>
          )}
        </div>
      </Sticky>
    </>
  );
};

export default Header;
