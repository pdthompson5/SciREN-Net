import React, { useEffect } from "react";
import styles from "@/styles/Form.module.css";
import { Field, Form, Formik} from "formik";

import useUser from "@/lib/useUser";
import {Button, Container} from "@mui/material"

import {TextField, Autocomplete, AutocompleteRenderInputParams} from "formik-mui"
import {TextField as MaterialTextField} from "@mui/material"
import * as Yup from 'yup';
import { GetUserResponse } from "./api/userSession";
import { KeyedMutator } from "swr";
import useSWR from "swr";
import { ScopedMutator } from "swr/_internal";
import fetchJson from "@/lib/fetchJson";
import Router from "next/router";
import Head from "next/head";
import Contact from "@/components/Contact";
import { useRouter } from 'next/router'
import { GetUserRequest } from "./api/user";
import { ProfileInformation } from "@/lib/database";

 
const ContactPage = () => {
    const router = useRouter()
    const userToContactID = router.query.user
    
    if(userToContactID === undefined || Array.isArray(userToContactID)){
        return (<><h1>You shouldn't be here...</h1></>)
    }

    const { data: userToContact, error} = useSWR<ProfileInformation>(`/api/user?userID=${userToContactID}`);
    if(error){
        console.error(error)
    }
    console.log(userToContact)

    const {user} = useUser((user) => "/login")
    return (
        <>
          <div style={{background: "aliceblue"}}>
            <Head>
              <title>Contact User - SciREN</title>
              <meta name="description" content="Contact User" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            {user && user.isLoggedIn && userToContact  ? 
              <Contact user={user} userToContact={userToContact}/>
              :<h1>Loading</h1>  
            }
      </div>
      </>
    )
  
};



export default ContactPage;


