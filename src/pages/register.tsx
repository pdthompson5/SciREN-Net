import React from "react";
import Head from "next/head";
import styles from "@/styles/Form.module.css";
import { PostUserResponse } from "./api/user";
import { useRouter } from "next/router";
import { Field, Form, Formik, FormikProps} from "formik";
import {TextField} from "formik-mui"
import * as Yup from 'yup';
import { gradeRangeOptions, academicInterestOptions, userTypes } from "./edit-profile";
import { AcademicInterests, Email, FirstName, GradeRange, LastName, Password, SubmitButton, UserType, VerifyPassword } from "@/components/FormComponents";
import { Alert, Container } from "@mui/material";

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;




const Register: React.FC = () => {
  const router = useRouter();

  const RegistrationSchema = Yup.object().shape({
    userType: Yup.string()
        .required("Required"),
    firstName: Yup.string()
        .min(2, 'Too Short')
        .max(80, 'Too Long')
        .required('Required'),
    lastName: Yup.string()
        .min(2, 'Too Short')
        .max(80, 'Too Long')
        .required('Required'),
    academicInterest: Yup.array(),
    gradeRange: Yup.array(),
    email: Yup.string()
      .matches(EMAIL_REGEX, "Invalid email format")
      .required("Required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .max(80, "Password must not exceed 80 characters")
      .required("Required"),
    verifyPassword: Yup.string()
      .required("Required")
  });

  return (
    <>
      <Head>
        <title>SciREN: Register an Account</title>
        <meta name="description" content="SciREN Profile Signup" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Formik enableReinitialize 
      initialValues={{userType: "researcher", firstName: "", lastName: "", academicInterest: [], gradeRange: [], email: "", password: "", verifyPassword: ""}} 
      validationSchema={RegistrationSchema} 
      onSubmit={async (values, actions) => {
        if(values.password !== values.verifyPassword){
          actions.setStatus({
            severity: "error",
            message: "Passwords do not match"
          });
          actions.setSubmitting(false)
          return
        }

        const {verifyPassword: _, ...postUser} = values;

        const resp = await fetch("/api/user", {
          method: "POST",
          body: JSON.stringify(postUser),
        });
    
        const body: PostUserResponse = await resp.json();
        console.log(body);
        if (resp.status >= 400) {

          actions.setStatus({
            severity: "error",
            message: body.message
          });
        } else {
          router.replace("/login");
        }

        actions.setStatus({
          severity: "success",
          message: "Successfully created user"
        })
        await new Promise(r => setTimeout(r, 1000));
        actions.setSubmitting(false)

      }}> 
        {(props: FormikProps<any>) => (
        <div className={styles.formLayout}>
          <Form>
            <Container>
              <h1 className={styles.loginTitle}>SciREN - Signup</h1>
              <UserType userTypes={userTypes} ></UserType>
              <FirstName/>
              <LastName/>
              <AcademicInterests academicInterestOptions={academicInterestOptions}/>
              <GradeRange gradeRangeOptions={gradeRangeOptions}/>
              <Email/>
              <Password/>
              <VerifyPassword/>
            
              {props.status ? 
                <Alert severity={props.status.severity} sx={{marginBottom: "10px"}}>{props.status.message}</Alert>
                :<span>&nbsp;&nbsp;&nbsp;</span>}
              <SubmitButton/>
              {/* { props.status && <p className={styles.error}>{props.status}</p>} */}

            </Container>
          </Form>
        </div>
        )}
      </Formik>
    </>
  );
};

export default Register;
