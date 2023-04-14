import React from "react";
import styles from "@/styles/Form.module.css";
import { Field, Form, Formik} from "formik";
import {Button, Container, Stack} from "@mui/material"
import {TextField} from "formik-mui"
import * as Yup from 'yup';
import { GetUserResponse } from "@/pages/api/userSession";
import { ProfileInformation } from "@/lib/database";
import Router from "next/router";
import { StatusAlert, SubmitButton } from "./FormComponents";


const MESSAGE_CHARACTER_LIMIT = 3000;

const Contact = (props: {user: GetUserResponse, userToContact: ProfileInformation}) => {
  const ContactUserSchema = Yup.object().shape({
    message: Yup.string()
        .min(2, 'Too Short!')
        .max(MESSAGE_CHARACTER_LIMIT, 'Too Long!')
        .required('Required')
  });
  const {user, userToContact} = props

  return (
    <>
      <div>
        <Formik
        validationSchema={ContactUserSchema}
        initialValues={{message: ""}}
        onSubmit={async (values, actions) => {    
            const contactRequest = {
              contactingUser: user,
              contactedUserEmail: userToContact.email,
              message: values.message
            }

            const resp = await fetch("/api/contact", {method: "POST", body: JSON.stringify(contactRequest)})

            if(resp.status != 200){
              actions.setStatus({
                severity: "error",
                message: resp.statusText
              });
              actions.setSubmitting(false);
            } else {
              actions.setStatus({
                severity: "success",
                message: "Successfully sent message"
              })
  
              actions.setSubmitting(false)
              await new Promise(r => setTimeout(r, 700));  
              Router.push(`/profiles/${userToContact.userID}`)
            }
          }}
      >
        {({status, values}) => (
        <Form className={styles.formLayout}>
          <Container>
          <Stack spacing={4}>
            <h1 className={styles.loginTitle}>Contact User: {userToContact.firstName} {userToContact.lastName}</h1>

            <div className={styles.inputBorder}>
              <Field 
                name="message"
                className={styles.formInput}
                component={TextField}
                multiline
                size="medium"
                type="text"
                label="Message"
                helperText={`${values.message.length}/${MESSAGE_CHARACTER_LIMIT}`}
                />
              <StatusAlert status={status}/>
            </div>

            <SubmitButton/>
          </Stack>
          </Container>
        </Form>
        )}
        
      </Formik>
      </div>
    </>
  )
  
};

export default Contact;
