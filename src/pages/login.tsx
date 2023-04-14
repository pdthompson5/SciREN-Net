import React from "react";
import useUser from "@/lib/useUser";
import fetchJson, { FetchError } from "@/lib/fetchJson";
import Head from "next/head";
import styles from "@/styles/Form.module.css";
import { GetUserResponse } from "./api/userSession";
import { Form, Formik} from "formik";
import { Container,} from "@mui/material"
import * as Yup from 'yup';
import { KeyedMutator } from "swr";
import { Email, Password, StatusAlert, SubmitButton } from "@/components/FormComponents";
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
              actions.setStatus({
                severity: "error", 
                message: error.data.message
              });
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
          <h1 className={styles.loginTitle}> SciREN - Login </h1>
          <Email/>
          <Password/>
          <StatusAlert status={status}/>
          <SubmitButton/>
        </Container>
      </Form>
      )}
      
    </Formik>
  )
}
