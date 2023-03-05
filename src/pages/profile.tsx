import React from "react";
import { useRouter } from 'next/router';
import useUser from "@/lib/useUser";


/* Redirect to signed-in users profile */
// May implement User type checking

const Profile: React.FC = () => {
  const { user, mutateUser } = useUser({
    redirectTo: "/login",
  });
  const router = useRouter();

  if (!user) {
    console.error("No user found!");
    return null
  }
  router.push(`/profiles/${user?.userID}`)

  return (
    <>
    </>
  )
}

export default Profile;
