import React, { useState } from "react";
import useUser from "@/lib/useUser";
import fetchJson, { FetchError } from "@/lib/fetchJson";
import Head from "next/head";

/* Login Page */

export default function Login() {
  // here we just check if user is already logged in and redirect to profile
  const { mutateUser } = useUser({
    redirectTo: "/profile",
    redirectIfFound: true,
  });

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
      <div>
        <h1> The login form is below, bro. </h1>
      </div>
      <form onSubmit={handleSubmit}>
      <label>
        <span>Enter your Email</span>
        <input type="text" name="email" required />
      </label>
      <label>
        <span>Enter your Password</span>
        <input type="password" name="password" required />
      </label>

      <button type="submit">Login</button>

      {errorMsg && <p className="error">{errorMsg}</p>}

      <style jsx>{`
        form,
        label {
          display: flex;
          flex-flow: column;
        }
        label > span {
          font-weight: 600;
        }
        input {
          padding: 8px;
          margin: 0.3rem 0 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .error {
          color: brown;
          margin: 1rem 0 0;
        }
      `}</style>
    </form>
    </>
    
  );
}
