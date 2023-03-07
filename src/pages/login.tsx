import React, { useState } from "react";
import useUser from "@/lib/useUser";
import fetchJson, { FetchError } from "@/lib/fetchJson";
import Head from "next/head";
import styles from "@/styles/Form.module.css";

/* Login Page */

export default function Login() {
  // here we just check if user is already logged in and redirect to profile
  const { mutateUser } = useUser(
    (user) => `/profiles/${user.userID}`,
    true,
  );

  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(event: any) {
    // Handle form submit button trigger
    event.preventDefault();
    console.log("Handling Submit. " + event.currentTarget.email.value)
    const body = {
      email: event.currentTarget.email.value,
      password: event.currentTarget.password.value,
    };

    try {
      mutateUser(
        await fetchJson("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
        false,
      );
      //TODO: Should we redirect to the user's profile here?
    } catch (error) {
      if (error instanceof FetchError) {
        setErrorMsg(error.data.message);
      } else {
        console.error("An unexpected error happened:", error);
      }
    }
  }

  return (
    <>
      <Head>
        <title>SciREN Login</title>
        <meta name="description" content="SciREN Login Page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.formLayout}>
        <div className={styles.loginTitle}>
          <h1> SCIRen - Login </h1>
        </div>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <label className={styles.loginLabel}>
            <span className={styles.loginPrompt}>Enter your Email</span>
            <input type="text" name="email" required className={styles.formInput} />
          </label>
          <label className={styles.loginLabel}>
            <span className={styles.loginPrompt}>Enter your Password</span>
            <input type="password" name="password" required className={styles.formInput} />
          </label>

          <button type="submit" className={styles.loginSubmit}>Login</button>

          {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        </form>
      </div>
    </>
  );
}
