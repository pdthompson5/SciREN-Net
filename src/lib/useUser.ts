import { useEffect } from "react";
import useSWR from "swr";
import { User } from "@/pages/api/user";
import Router from "next/router";

/*
* Called when a page needs access to user state. 
*/

export default function useUser(
  redirectTo?: ((user: User) => string),
  redirectIfFound: boolean = false,
) {
  const { data: user, mutate: mutateUser } = useSWR<User>("/api/user");

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !user) return;

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user?.isLoggedIn)
    ) {
      Router.push(redirectTo(user));
    }
  }, [user, redirectIfFound, redirectTo]);

  return { user, mutateUser };
}
