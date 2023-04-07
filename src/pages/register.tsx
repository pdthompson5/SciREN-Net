import React from "react";
import Head from "next/head";
import styles from "@/styles/Form.module.css";
import { PostUserResponse } from "./api/user";
import { useRouter } from "next/router";
import { Field, Form, Formik, FormikProps} from "formik";
import {TextField, Autocomplete, AutocompleteRenderInputParams} from "formik-mui"
import {Button} from "@mui/material"
import {TextField as MaterialTextField} from "@mui/material"
import * as Yup from 'yup';
import { gradeRangeOptions, academicInterestOptions, userTypes } from "./edit-profile";
import { AcademicInterests, Email, FirstName, GradeRange, LastName, Password, SubmitButton, UserType } from "@/components/FormComponents";

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
          actions.setStatus("Passwords do not match")
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
          actions.setStatus(body.message);
        } else {
          router.replace("/login");
        }

        actions.setStatus("Successfully created user")
        await new Promise(r => setTimeout(r, 1000));
        actions.setSubmitting(false)

      }}> 
        {(props: FormikProps<any>) => (
        <div className={styles.formLayout}>
          <h1>SciREN - Signup</h1>
          <Form>
            <div className={styles.loginForm}>
              <UserType userTypes={userTypes}></UserType>
              <FirstName/>
              <LastName/>
              <AcademicInterests academicInterestOptions={academicInterestOptions}/>
              <GradeRange gradeRangeOptions={gradeRangeOptions}/>
              <Email/>
              <Password/>

              <Field name="verifyPassword" className={styles.formInput} component={TextField} type="password" label="Verify Password"/>

              <SubmitButton/>

              { props.status && <p className={styles.error}>{props.status}</p>}
              {/* TODO: Add message for successful submission */}
            </div>
          </Form>
        </div>
        )}
      </Formik>
    </>
  );
};

export default Register;
