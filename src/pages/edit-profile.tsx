import React from "react";
import styles from "@/styles/Form.module.css";
import { Field, Form, Formik, FormikProps} from "formik";

import useUser from "@/lib/useUser";
import {Button} from "@mui/material"
import {TextField, Autocomplete, Select, AutocompleteRenderInputParams} from "formik-mui"
import {TextField as MaterialTextField} from "@mui/material"
import * as Yup from 'yup';
import { GetUserResponse } from "./api/userSession";
import { academicInterestOptions, gradeRangeOptions, userTypes } from "./api/user";


/* Registration Page */
//TODO: Apply templated handlers
//TODO: Template academic interest form elements
// TODO: Actually edit database -> This should just update the fields

const capitalizeField = (field: string) => {
    const words = field.split(" ");
    return words.map((word) => { 
        return word[0].toUpperCase() + word.substring(1); 
    }).join(" ");
}


const EditProfile = () => {

    const {user} = useUser((user) => "/login")
    return (
        <>
          <div>
          <h1>Edit Profile</h1>
          {user ? 
            user.isLoggedIn ?
              editProfileForm(user):
            <h1>Loading</h1>:
            <h1>Loading</h1>
          }
      </div>
      </>
    )
  
};

const editProfileForm = (user: GetUserResponse) =>{
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
      onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 1000);
        }}
    >
      {(props: FormikProps<any>) => (
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
      </Form>
      )}
      
    </Formik>
  )
}

export default EditProfile;
