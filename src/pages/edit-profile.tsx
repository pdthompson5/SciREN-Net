import React from "react";
import styles from "@/styles/Form.module.css";
import { Form, Formik, FormikProps } from "formik";

import useUser from "@/lib/useUser";
import { Button, Container } from "@mui/material";

import * as Yup from "yup";
import { GetUserResponse } from "./api/userSession";
import { KeyedMutator, useSWRConfig } from "swr";
import { ScopedMutator } from "swr/_internal";
import fetchJson from "@/lib/fetchJson";
import Router, { NextRouter, useRouter } from "next/router";
import Head from "next/head";
import {
  AcademicInterests,
  FirstName,
  GradeRange,
  LastName,
  Organization,
  Position,
  SciRENRegion,
  StatusAlert,
  SubmitButton,
  TextBio,
  UserType,
} from "@/components/FormComponents";

export const gradeRangeOptions = [
  "Pre-K",
  "Kindergarten",
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
  "College",
];

/*
Categories:



*/

export const academicInterestOptions = [
  // General
  "General (all subjects)",

  "Mathematics",
  "Biology",
  "Chemistry",
  "Social Studies",
  "History",
  "Sociology",
  "Anatomy",
  "Geography",
  "Physiology",
  "Physics",
  "Psychology",
  "Special Education",
  // Sciences
  "Physical Science",
  "Environmental Science",
  "Computer Science",
  "Geological Sciences",
  "Earth and Space Science",
  "Biological Sciences",
  // Engineering
  "General Engineering",

  "Aerospace Engineering",
  "Biological Engineering",
  "Civil Engineering",
  "Construction Engineering",
  "Chemical Engineering",
  "Environmental Engineering",
  "Mechanical Engineering",
  "Metallurgical and Materials Engineering",
  "Electrical and Computer Engineering",
  // Other
  "Educational Psychology and Research",
];

export const userTypes = ["researcher", "teacher", "student", "admin"];

export const organizationOptions = [
  "The University of Alabama",
  "University of Georgia",
  "U.S. Navy",
  "Scripps Institution of Oceanography",
  "University of California San Diego",
  "San Diego State University",
  "Salk Institute for Biological Sciences",
  "UNC Chapel Hill",
  "Duke University",
  "George Mason University",
];

export const regionOptions = [
  "Alabama",
  "Coast",
  "Triangle",
  "Georgia",
  "George Mason",
  "San Diego",
  "None",
];

const EditProfile = () => {
  const { mutate } = useSWRConfig();
  const router = useRouter();

  const { user, mutateUser } = useUser((user) => "/login");
  return (
    <>
      <div>
        <Head>
          <title>Edit Profile - SciREN</title>
          <meta name="description" content="Edit User Profile" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {user ? (
          user.isLoggedIn ? (
            editProfileForm(user, mutateUser, mutate, router)
          ) : (
            <h1>Loading</h1>
          )
        ) : (
          <h1>Loading</h1>
        )}
      </div>
    </>
  );
};

const editProfileForm = (
  user: GetUserResponse,
  mutateUser: KeyedMutator<GetUserResponse>,
  mutate: ScopedMutator,
  router: NextRouter
) => {
  const EditUserSchema = Yup.object().shape({
    userType: Yup.string().required("Required"),
    firstName: Yup.string()
      .min(2, "Too Short!")
      .max(80, "Too Long!")
      .required("Required"),
    lastName: Yup.string()
      .min(2, "Too Short!")
      .max(80, "Too Long!")
      .required("Required"),
    academicInterest: Yup.array(),
    gradeRange: Yup.array(),
    textBio: Yup.string(),
    organizations: Yup.array(),
    position: Yup.string(),
    scirenRegion: Yup.string().required("Required"),
  });

  return (
    <Formik
      enableReinitialize
      validationSchema={EditUserSchema}
      initialValues={{
        userType: user.userType,
        firstName: user.firstName,
        lastName: user.lastName,
        academicInterest: user.academicInterest,
        gradeRange: user.gradeRange,
        textBio: user.textBio,
        organizations: user.organizations,
        position: user.position,
        scirenRegion: user.scirenRegion,
      }}
      onSubmit={async (values, actions) => {
        values["gradeRange"] = values.gradeRange.sort();
        const valuesWithID = {
          userID: user.userID,
          email: user.email,
          ...values,
        };

        await fetch("/api/editUser", {
          method: "POST",
          body: JSON.stringify(valuesWithID),
        }).then((resp) => {
          if (resp.status !== 200) {
            actions.setStatus({
              severity: "error",
              message: resp.statusText,
            });
            actions.setSubmitting(false);
          } else {
            Router.push(`/profiles/${user.userID}`).then(() => {
              mutateUser(
                fetchJson("/api/userSession", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(valuesWithID),
                }),
                false
              );
              actions.setSubmitting(false);
              Router.reload();
            });
          }
        });
      }}
    >
      {(props: FormikProps<any>) => (
        <Form className={styles.formLayout}>
          <Container>
            <h1 className={styles.loginTitle}>Edit Profile</h1>
            <UserType
              userTypes={userTypes}
              touched={props.touched}
              errors={props.errors}
            />
            <FirstName />
            <LastName />
            {props.values["userType"] === "teacher" ? (
              <AcademicInterests
                academicInterestOptions={academicInterestOptions}
                label="Subjects Taught"
              />
            ) : (
              <AcademicInterests
                academicInterestOptions={academicInterestOptions}
                label="Research Areas"
              />
            )}
            {props.values["userType"] === "teacher" && (
              <GradeRange gradeRangeOptions={gradeRangeOptions} />
            )}
            <Organization organizationOptions={organizationOptions} />
            <Position />
            <TextBio />
            <SciRENRegion
              regionOptions={regionOptions}
              touched={props.touched}
              errors={props.errors}
            />
            <StatusAlert status={props.status} />
            <SubmitButton />
            {deleteProfileButton(mutateUser, user, router)}
          </Container>
        </Form>
      )}
    </Formik>
  );
};

const deleteProfileButton = (
  mutateUser: KeyedMutator<GetUserResponse>,
  user: GetUserResponse,
  router: NextRouter
) => {
  return (
    <div className={styles.deleteUserContainer}>
      <Button
        variant="contained"
        color="error"
        className={styles.deleteUserButton}
        onClick={async (e) => {
          e.preventDefault();
          fetch(`/api/user?userID=${user?.userID}`, { method: "DELETE" }),
            false;
          mutateUser(await fetchJson("/api/logout", { method: "POST" }), false);
          router.replace("/login");
        }}
        type="submit"
      >
        Delete Account
      </Button>
    </div>
  );
};

export default EditProfile;
