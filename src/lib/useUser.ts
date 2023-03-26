import { useEffect } from "react";
import Router from "next/router";
import useSWR from "swr";
import { GetUserResponse } from "@/pages/api/userSession";

/*
 * Called when a page needs access to user state.
 */
export default function useUser(
  redirectTo?: (user: GetUserResponse) => string,
  redirectIfFound: boolean = false
) {
  const { data: resp, mutate: mutateUser } =
    useSWR<GetUserResponse>("/api/userSession");

  useEffect(() => {
    if (resp === undefined) {
      return;
    }

    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !resp) return;

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !resp?.isLoggedIn) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && resp?.isLoggedIn)
    ) {
      Router.push(redirectTo(resp));
    }
  }, [resp, redirectIfFound, redirectTo]);

  return { user: resp, mutateUser };
}
