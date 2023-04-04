import React, { useState } from "react";
import useUser from "@/lib/useUser";
import fetchJson, { FetchError } from "@/lib/fetchJson";
import Head from "next/head";
import styles from "@/styles/Form.module.css";
import { GetUserResponse } from "./api/userSession";
import { Field, Form, Formik} from "formik";
import {TextField} from "formik-mui"
import {Button, Container,} from "@mui/material"
import * as Yup from 'yup';
import { KeyedMutator } from "swr";
/* Login Page */

export default function Login() {
  // here we just check if user is already logged in and redirect to profile
  const { mutateUser } = useUser(
    (user: GetUserResponse) => `/profiles/${user.userID}`,
    true
  );

  return (
    <>
      <div>
        <Head>
          <title>SciREN Login</title>
          <meta name="description" content="SciREN Login Page" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {loginForm(mutateUser)}
      </div>
    </>
  );
}


const loginForm = (mutateUser: KeyedMutator<GetUserResponse>) =>{
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .required("Required"),
    password: Yup.string()
        .required('Required'),
  });

  return (
    <Formik
      initialValues={{email: "", password: ""}}
      enableReinitialize
      validationSchema={LoginSchema}
      onSubmit={async (values, actions) => {    
          console.log(values)

          const body = {
            email: values.email,
            password: values.password,
          };

          try {
            mutateUser(
              await fetchJson("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
              }),
              false
            );
          } catch (error) {
            if (error instanceof FetchError) {
              actions.setStatus(error.data.message);
            } else {
              console.error("An unexpected error happened:", error);
            }
          }

          actions.setSubmitting(false)
        }}
    >
      {({status}) => (
      <Form className={styles.formLayout}>
        <Container>
          <h1 className={styles.loginTitle}> SCIRen - Login </h1>
          <Field name="email" className={styles.formInput} component={TextField} size="medium" type="text" label="Email"/>
          <Field name="password" className={styles.formInput} component={TextField} margin="normal" size="medium" type="password" label="Password"/>
          <Button variant="contained" type="submit" className={styles.loginSubmit}>Submit</Button>
          { status && <h3 className={styles.error}>{status}</h3>}
        </Container>
      </Form>
      )}
      
    </Formik>
  )
}
