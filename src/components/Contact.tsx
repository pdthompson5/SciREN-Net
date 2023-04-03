import React from "react";
import styles from "@/styles/Form.module.css";
import { Field, Form, Formik} from "formik";

import useUser from "@/lib/useUser";
import {Button, Container, Stack} from "@mui/material"

import {TextField, Autocomplete, AutocompleteRenderInputParams} from "formik-mui"
import {TextField as MaterialTextField} from "@mui/material"
import * as Yup from 'yup';
import { GetUserResponse } from "@/pages/api/userSession";
import { KeyedMutator, useSWRConfig } from "swr";
import { ScopedMutator } from "swr/_internal";
import fetchJson from "@/lib/fetchJson";
import Router from "next/router";
import Head from "next/head";
import { ProfileInformation } from "@/lib/database";




const capitalizeField = (field: string) => {
    const words = field.split(" ");
    return words.map((word) => { 
        return word[0].toUpperCase() + word.substring(1); 
    }).join(" ");
}

const MESSAGE_CHARACTER_LIMIT = 3000;

 
const Contact = (props: {user: GetUserResponse, userToContact: ProfileInformation}) => {

    return (
      <>
        <div>
          {contactUserForm(props.user, props.userToContact)}
        </div>
      </>
    )
  
};

const contactUserForm = (user: GetUserResponse, userToContact: ProfileInformation) => {
  const ContactUserSchema = Yup.object().shape({
    message: Yup.string()
        .min(2, 'Too Short!')
        .max(MESSAGE_CHARACTER_LIMIT, 'Too Long!')
        .required('Required')
  });

  return (
    <Formik
      validationSchema={ContactUserSchema}
      initialValues={{message: ""}}
      onSubmit={async (values, actions) => {    
          console.log(values)
          console.log(userToContact)
          console.log(user)

          const contactRequest = {
            contactingUser: user,
            contactedUserEmail: userToContact.email,
            message: values.message
          }

          await fetch("/api/contact", {method: "POST", body: JSON.stringify(contactRequest)})
          actions.setSubmitting(false)
        }}
    >
      {({status, values}) => (
      <Form className={styles.formLayout}>
        <Stack spacing={4}>
          <h1 className={styles.loginTitle}>Contact User</h1>

          {/* TODO: display number of chars remaining */}
          <Field 
            name="message"
            className={styles.formInput}
            component={TextField}
            multiline
            variant="standard"
            size="medium"
            type="text"
            label="Message"
            helperText={`${values.message.length}/${MESSAGE_CHARACTER_LIMIT}`}
            />

          <Button variant="contained" type="submit" className={styles.loginSubmit}>Submit</Button>
          { status && <p className={styles.error}>{status.message}</p>}
        </Stack>
      </Form>
      )}
      
    </Formik>
  )
}

export default Contact;
