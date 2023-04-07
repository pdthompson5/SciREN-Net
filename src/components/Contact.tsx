import React from "react";
import styles from "@/styles/Form.module.css";
import { Field, Form, Formik} from "formik";
import {Button, Container, Stack} from "@mui/material"
import {TextField} from "formik-mui"
import * as Yup from 'yup';
import { GetUserResponse } from "@/pages/api/userSession";
import { ProfileInformation } from "@/lib/database";
import Router from "next/router";


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
              actions.setStatus({message: resp.statusText});
              actions.setSubmitting(false);
              return;
            }

            actions.setStatus({message: "Successfully sent message"})

            actions.setSubmitting(false)
            Router.push(`/profiles/${userToContact.userID}`)
          
          }}
      >
        {({status, values}) => (
        <Form className={styles.formLayout}>
          <Container>
          <Stack spacing={4}>
            <h1 className={styles.loginTitle}>Contact User: {userToContact.firstName} {userToContact.lastName}</h1>

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
            { status && <p>{status.message}</p>}
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
