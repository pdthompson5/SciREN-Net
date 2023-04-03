import React from "react";
import useUser from "@/lib/useUser";
import useSWR from "swr";
import Head from "next/head";
import Contact from "@/components/Contact";
import { useRouter } from 'next/router'
import { ProfileInformation } from "@/lib/database";

 
const ContactPage = () => {
    const router = useRouter()
    const userToContactID = router.query.user

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
