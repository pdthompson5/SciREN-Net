// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import type { IronSessionOptions } from "iron-session";
import type { User } from "@/pages/api/user";

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,   // Secure password, decodes cookie
  cookieName: "iron-session/examples/next.js",              // Name of cookie (appears in browser)
  cookieOptions: {              
    secure: process.env.NODE_ENV === "production",          // TODO: What does this do?
  },
};

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}
