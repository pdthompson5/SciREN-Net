import React from "react";
import styles from "@/styles/Form.module.css";
import { Field, Form, Formik, FormikProps} from "formik";

import useUser from "@/lib/useUser";
import {Button} from "@mui/material"
import {TextField, Autocomplete, Select, AutocompleteRenderInputParams} from "formik-mui"
import {TextField as MaterialTextField} from "@mui/material"
import * as Yup from 'yup';
import { GetUserResponse } from "./api/userSession";
import { KeyedMutator, useSWRConfig } from "swr";
import { ScopedMutator } from "swr/_internal";
import fetchJson, { FetchError } from "@/lib/fetchJson";
import Router from "next/router";


/* Registration Page */
export const gradeRangeOptions = ["Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"]
export const academicInterestOptions = ["mathematics", "biology", "chemistry", "social studies", "history", "sociology"];
export const userTypes = ["researcher", "teacher", "student", "admin"]

const capitalizeField = (field: string) => {
    const words = field.split(" ");
    return words.map((word) => { 
        return word[0].toUpperCase() + word.substring(1); 
    }).join(" ");
}

 
const EditProfile = () => {
    const { mutate } = useSWRConfig()

    const {user, mutateUser} = useUser((user) => "/login")
    return (
        <>
          <div>
          <h1>Edit Profile</h1>
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
        .max(50, 'Too Long!')
        .required('Required'),
    lastName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
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
          const resp = await fetch("/api/editUser", {
            method: "POST",
            body: JSON.stringify(valuesWithID),
          });
          if(resp.status != 200){
            actions.setStatus({message: resp.statusText});
            actions.setSubmitting(false);
            return;
          }

          await Router.push(`/profiles/${user.userID}`)

          await mutateUser(
            await fetchJson("/api/userSession", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(valuesWithID),
            }),
            false
          );

          actions.setSubmitting(false)
        }}
    >
      {({status}) => (
      <Form className={styles.loginForm}>
        <Field 
            name="userType"
            className={styles.formInput}
            component={Autocomplete}
            label="User Type"
            options={userTypes}
            getOptionLabel={(option: string) => capitalizeField(option)}
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

        <Field name="firstName" className={styles.formInput} component={TextField} type="text" label="First Name"/>
        <Field name="lastName" className={styles.formInput} component={TextField} type="text"  label="Last Name"/>

        <Field 
            name="academicInterest"
            className={styles.formInput}
            component={Autocomplete}
            label="Academic Interests"
            options={academicInterestOptions}
            multiple
            getOptionLabel={(option: string) => capitalizeField(option)}
            renderInput={(params: AutocompleteRenderInputParams) => (
              <MaterialTextField
                {...params}
                name="academicInterest"
                label="Academic Interests"
                variant="outlined"
              />
            )}
            >
        </Field>

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
        <Button variant="contained" type="submit" className={styles.loginSubmit}>Submit</Button>
        { status && <p className={styles.error}>{status.message}</p>}
      </Form>
      )}
      
    </Formik>
  )
}

export default EditProfile;
