import React, { useState } from "react";
import Head from "next/head";
import styles from "@/styles/Form.module.css";
import { User } from "./api/userSession";
import { PostUserRequest, PostUserResponse } from "./api/user";
import { useRouter, Router } from "next/router";
import { Field, Form, Formik, FormikProps} from "formik";
import {TextField, Autocomplete, Select, AutocompleteRenderInputParams} from "formik-mui"
import {Button} from "@mui/material"
import {TextField as MaterialTextField} from "@mui/material"
import * as Yup from 'yup';

export const gradeRangeOptions = ["Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"]
export const academicInterestOptions = ["mathematics", "biology", "chemistry", "social studies", "history", "sociology"];
export const userTypes = ["researcher", "teacher", "student", "admin"]

type AcademicInterestClass =
  | "mathematics"
  | "biology" 
  | "chemistry"
  | "social studies"
  | "history"
  | "none";

/* Registration Page */
//TODO: Apply templated handlers
//TODO: Template academic interest form elements

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
  // Form field change hooks
  // const handleField = (setter: any) => {
  //   // Handles all fields which require no special parsing
  //   return (event: any) => {
  //     setter(event.target.value);
  //     setSubmitted(false);
  //   };
  // };
  // const handleGradeRange = (event: any) => {
  //   var options = event.target.options;
  //   var selectedValues: Array<number> = [];
  //   for (var i = 0, l = options.length; i < l; i++) {
  //     if (options[i].selected) {
  //       selectedValues.push(+options[i].value);
  //     }
  //   }
  //   setGradeRange(event.target.value); // Always returns sorted.
  //   setSubmitted(false);
  // };
  // const handleAcademicInterests = (event: any) => {
  //   var options = event.target.options;
  //   var selectedValues: Array<string> = [];
  //   for (var i = 0, l = options.length; i < l; i++) {
  //     if (options[i].selected) {
  //       selectedValues.push(options[i].value);
  //     }
  //   }
  //   setAcademicInterests(selectedValues);
  // };
  // Field validation
  const validateEmail = (e: string): boolean => {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return e.toLowerCase().match(regex) !== null;
  };

  const validatePassword = (p: string, verify: string) => {
    if (p.length < 8) {
      return "Password must be at least 8 characters long.";
    } else if (p !== verify) {
      return "Passwords do not match.";
    }
    return null;
  };

  // Add user call
  // Note: no need for arguments, just use react state
  const addUser = async (postUser: PostUserRequest) => {
    const resp = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(postUser),
    });

    const body: PostUserResponse = await resp.json();
    console.log(body);
    // if (resp.status >= 400) {
    //   setError(body.message);
    // } else {
    //   setError(undefined);
    //   router.replace("/login");
    // }
    console.log(resp.status);
  };

  // form submission handler
  // const handleSubmit = (event: any) => {
  //   event.preventDefault();
  //   if (
  //     email === "" ||
  //     password === "" ||
  //     firstName === "" ||
  //     lastName === ""
  //   ) {
  //     // Any fields missing data
  //     setError("Please fill out all fields before submitting.");
  //   } else {
  //     // Run field validation checks
  //     if (!validateEmail(email)) {
  //       setError("Invalid email provided.");
  //       return;
  //     } else {
  //       // Password checks
  //       const passwordError = validatePassword(password, verifyPassword);
  //       if (passwordError !== null) {
  //         setError(passwordError);
  //         return;
  //       }
  //     }

  //     console.log("Form checks complete.");
  //     addUser();

  //     console.log("Submission complete.");
  //     // All other checks passed
  //     setSubmitted(true);
  //     setError(undefined);
  //   }
  // };

  // const EditUserSchema = Yup.object().shape({
  //   userType: Yup.string()
  //       .required("Required"),
  //   firstName: Yup.string()
  //       .min(2, 'Too Short!')
  //       .max(50, 'Too Long!')
  //       .required('Required'),
  //   lastName: Yup.string()
  //       .min(2, 'Too Short!')
  //       .max(50, 'Too Long!')
  //       .required('Required'),
  //   academicInterest: Yup.array(),
  //   gradeRange: Yup.array()
  // });

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
      // validationSchema={EditUserSchema} 
      onSubmit={async (values, actions) => {  
        addUser(values)
        actions.setSubmitting(false)
        console.log(values)
      }}> 
        {(props: FormikProps<any>) => (
        <div className={styles.formLayout}>
          <h1>SciREN - Signup</h1>
          <Form>
            <div className={styles.loginFormFL}>
              {/* Name */}
              <Field name="firstName" className={styles.formInput} component={TextField} type="text" label="First Name"/>
              <Field name="lastName" className={styles.formInput} component={TextField} type="text"  label="Last Name"/>
            </div> 
            
            <div className={styles.loginForm}>
              {/* User type */}
              <Field 
              name="userType"
              className={styles.formInput}
              component={Autocomplete}
              label="User Type"
              options={userTypes}
              renderInput={(params: AutocompleteRenderInputParams) => (
                <MaterialTextField
                  {...params}
                  name="userType"
                  label="User Type"
                  variant="outlined"
                />
              )}
              >
              </Field>
              {/* Academic interests */}
              <Field 
              name="academicInterest"
              className={styles.formInput}
              component={Autocomplete}
              label="Academic Interests"
              options={academicInterestOptions}
              multiple  
              renderInput={(params: AutocompleteRenderInputParams) => (
                <MaterialTextField
                  {...params}
                  name="academicInterest"
                  label="Academic Interests"
                  variant="outlined"
                />
              )}>
              </Field>
              {/* Grade Range */}
              <Field 
              name="gradeRange"
              className={styles.formInput}
              component={Autocomplete}
              label="Grade Range"
              options={gradeRangeOptions.map((x, i) => i)}
              getOptionLabel={(option: number) => gradeRangeOptions[option]}
              multiple
              renderInput={(params: AutocompleteRenderInputParams) => (
                <MaterialTextField
                  {...params}
                  name="gradeRange"
                  label="Grade Range"
                  variant="outlined"
                />
              )}
              >
              </Field>
              {/* Email */}
              {/* <input
                onChange={handleField(setEmail)}
                placeholder="Email"
                required
                className={styles.formInput}
                value={email}
                type="text"
              /> */}
              <Field name="email" className={styles.formInput} component={TextField} type="text" label="Email"/>
              {/* Password */}
              {/* <input
                onChange={handleField(setPassword)}
                placeholder="Password"
                required
                className={styles.formInput}
                value={password}
                type="password"
              /> */}
              <Field name="password" className={styles.formInput} component={TextField} type="text" label="Password"/>
              {/* Verify Password */}
              {/* <input
                onChange={handleField(setVerifyPassword)}
                placeholder="Verify Password"
                required
                className={styles.formInput}
                value={verifyPassword}
                type="password"
              /> */}
              <Field name="verifyPassword" className={styles.formInput} component={TextField} type="text" label="Verify Password"/>
              {/* Submit */}
              <Button variant="contained" type="submit" className={styles.loginSubmit}>Submit</Button>

              {/* {error && <p className={styles.error}>{error}</p>} */}
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
