import React from "react";
import Head from "next/head";
import styles from "@/styles/Form.module.css";
import { PostUserRequest, PostUserResponse } from "./api/user";
import { useRouter } from "next/router";
import { Field, Form, Formik, FormikProps} from "formik";
import {TextField} from "formik-mui"
import * as Yup from 'yup';
import { gradeRangeOptions, academicInterestOptions, userTypes, regionOptions, organizationOptions } from "./edit-profile";
import { AcademicInterests, Email, FirstName, GradeRange, LastName, Organization, Password, Position, SciRENRegion, StatusAlert, SubmitButton, TextBio, UserType, VerifyPassword } from "@/components/FormComponents";
import { Alert, Container } from "@mui/material";

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;




// Field validation
export const validateEmail = (e: string): boolean => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return e.toLowerCase().match(regex) !== null;
};

export const validatePassword = (p1: string, p2: string) => {
  if (p1.length < 8) {
    return "Password must be at least 8 characters long.";
  } else if (p1 !== p2) {
    return "Passwords do not match.";
  }
  return null;
};

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
    textBio: Yup.string(),
    organizations: Yup.array(),
    position: Yup.string(),
    scirenRegion: Yup.string(),
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
      initialValues={{
        userType: "researcher",
        firstName: "",
        lastName: "",
        academicInterest: [],
        gradeRange: [],
        textBio: "",
        organizations: [],
        position: "",
        scirenRegion: "Alabama",
        email: "",
        password: "",
        verifyPassword: ""
      }} 
      validationSchema={RegistrationSchema} 
      onSubmit={async (values, actions) => {
        // TODO: Impl this
        console.log(values)
        actions.setSubmitting(false)
        
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
        if (resp.status >= 400) {
          actions.setStatus({
            severity: "error",
            message: body.message
          });
          actions.setSubmitting(false);
        } else {
          actions.setStatus({
            severity: "success",
            message: "Successfully created user"
          })
          actions.setSubmitting(false);
          await new Promise(r => setTimeout(r, 1000));
          router.replace("/login");
        }
      }}> 
        {(props: FormikProps<any>) => (
        <div className={styles.formLayout}>
          <Form>
            <Container>
              <h1 className={styles.loginTitle}>SciREN - Signup</h1>
              <UserType userTypes={userTypes}/>
              <FirstName/>
              <LastName/>
              {/* TODO: Determine what categories we want to choose from, we might just want to separate these */}
              {props.values["userType"] === "teacher" ? 
                <AcademicInterests academicInterestOptions={academicInterestOptions} label="Subjects Taught" freeSolo={false}/>
                :<AcademicInterests academicInterestOptions={academicInterestOptions} label="Research Areas" freeSolo/>
              }
              {props.values["userType"] === "teacher" && <GradeRange gradeRangeOptions={gradeRangeOptions}/>}
              <Organization organizationOptions={organizationOptions}/>
              <Position/>
              <TextBio/>
              <SciRENRegion regionOptions={regionOptions}/>
              <Email/>
              <Password/>
              <VerifyPassword/>
          
              <StatusAlert status={props.status}/>
              <SubmitButton/>
            </Container>
          </Form>
        </div>
        )}
      </Formik>
    </>
  );
};

export default Register;
