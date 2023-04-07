import React from "react";
import styles from "@/styles/Form.module.css";
import { Form, Formik} from "formik";

import useUser from "@/lib/useUser";
import {Container} from "@mui/material"

import * as Yup from 'yup';
import { GetUserResponse } from "./api/userSession";
import { KeyedMutator, useSWRConfig } from "swr";
import { ScopedMutator } from "swr/_internal";
import fetchJson from "@/lib/fetchJson";
import Router from "next/router";
import Head from "next/head";
import { AcademicInterests, FirstName, GradeRange, LastName, StatusAlert, SubmitButton, UserType } from "@/components/FormComponents";


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

export const academicInterestOptions = ["mathematics", "biology", "chemistry", "social studies", "history", "sociology"];
export const userTypes = ["researcher", "teacher", "student", "admin"]
 
const EditProfile = () => {
    const { mutate } = useSWRConfig()

    const {user, mutateUser} = useUser((user) => "/login")
    return (
        <>
          <div>
            <Head>
              <title>Edit Profile - SciREN</title>
              <meta name="description" content="Edit User Profile" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            {user ? 
              user.isLoggedIn ?
                editProfileForm(user, mutateUser, mutate):
                <h1>Loading</h1>
              :<h1>Loading</h1>  
            }
      </div>
      </>
    )
  
};

const editProfileForm = (user: GetUserResponse, mutateUser: KeyedMutator<GetUserResponse>, mutate: ScopedMutator) =>{
  const EditUserSchema = Yup.object().shape({
    userType: Yup.string()
        .required("Required"),
    firstName: Yup.string()
        .min(2, 'Too Short!')
        .max(80, 'Too Long!')
        .required('Required'),
    lastName: Yup.string()
        .min(2, 'Too Short!')
        .max(80, 'Too Long!')
        .required('Required'),
    academicInterest: Yup.array(),
    gradeRange: Yup.array()
  });

  return (
    <Formik
      enableReinitialize
      validationSchema={EditUserSchema}
      initialValues={{userType: user.userType, firstName: user.firstName, lastName: user.lastName, academicInterest: user.academicInterest, gradeRange: user.gradeRange}}
      onSubmit={async (values, actions) => {    
          const valuesWithID = {
            userID: user.userID,
            email: user.email,
            ...values
          }          

          await fetch("/api/editUser", {
            method: "POST",
            body: JSON.stringify(valuesWithID),
          }).then(
            (resp) => {
              if(resp.status !== 200){
                actions.setStatus({
                  severity: "error",
                  message: resp.statusText
                });
                actions.setSubmitting(false);
                return;
              }
              else{
                Router.push(`/profiles/${user.userID}`).then(
                  () => {
                    mutateUser(
                      fetchJson("/api/userSession", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(valuesWithID),
                      }),
                      false
                    );
                    actions.setSubmitting(false)
                    Router.reload()
                  }
                )
              }
            } 
          )
        }}
    >
      {({status}) => (
      <Form className={styles.formLayout}>
        <Container>
          <h1 className={styles.loginTitle}>Edit Profile</h1>
          <UserType userTypes={userTypes}></UserType>
          <FirstName/>
          <LastName/>
          <AcademicInterests academicInterestOptions={academicInterestOptions}/>
          <GradeRange gradeRangeOptions={gradeRangeOptions}/>
          <StatusAlert status={status}/>
          <SubmitButton/>
        </Container>
      </Form>
      )}
      
    </Formik>
  )
}

export default EditProfile;
