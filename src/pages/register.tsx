import React, { useState } from "react";
import Head from "next/head";
import styles from "@/styles/Form.module.css";
import { User } from "./api/userSession";
import { PostUserRequest, PostUserResponse } from "./api/user";
import { useRouter, Router } from "next/router";

type UserType = "researcher" | "teacher" | "student" | "admin";

type AcademicInterestClass =
  | "mathematics"
  | "biology"
  | "chemistry"
  | "social studies"
  | "history"
  | "none";

/* Registration Page */
//TODO: Apply templated handlers
//TODO: Template academic interest form elements

// Field validation
export const validateEmail = (e: string): boolean => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return e.toLowerCase().match(regex) !== null;
};

export const validatePassword = (p1: string, p2: string) => {
  if (p1.length < 8) {
    return "Password must be at least 8 characters long.";
  } else if (p1 !== p2) {
    return "Passwords do not match.";
  }
  return null;
};

const Register: React.FC = () => {
  const router = useRouter();
  // state for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // Three academic interests allowed
  const [academicInterests, setAcademicInterests] = useState(["mathematics"]);
  const [gradeRange, setGradeRange] = useState<number[]>([]);
  const [userType, setUserType] = useState<UserType>("researcher");

  // state for submit, error
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Form field change hooks
  const handleField = (setter: any) => {
    // Handles all fields which require no special parsing
    return (event: any) => {
      setter(event.target.value);
      setSubmitted(false);
    };
  };
  const handleGradeRange = (event: any) => {
    var options = event.target.options;
    var selectedValues: Array<number> = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        selectedValues.push(+options[i].value);
      }
    }
    setGradeRange(selectedValues); // Always returns sorted.
    setSubmitted(false);
  };
  const handleAcademicInterests = (event: any) => {
    var options = event.target.options;
    var selectedValues: Array<string> = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setAcademicInterests(selectedValues);
  };

  // Add user call
  // Note: no need for arguments, just use react state
  const addUser = async () => {
    setSubmitted(true);

    const postUser: PostUserRequest = {
      email: email,
      password: password,
      userType: userType,
      firstName: firstName,
      lastName: lastName,
      academicInterest: academicInterests,
      gradeRange: gradeRange,
    };
    const resp = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(postUser),
    });

    const body: PostUserResponse = await resp.json();
    console.log(body);
    if (resp.status >= 400) {
      setError(body.message);
    } else {
      setError(undefined);
      router.replace("/login");
    }
    console.log(resp.status);
  };

  // form submission handler
  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (
      email === "" ||
      password === "" ||
      firstName === "" ||
      lastName === ""
    ) {
      // Any fields missing data
      setError("Please fill out all fields before submitting.");
    } else {
      // Run field validation checks
      if (!validateEmail(email)) {
        setError("Invalid email provided.");
        return;
      } else {
        // Password checks
        const passwordError = validatePassword(password, verifyPassword);
        if (passwordError !== null) {
          setError(passwordError);
          return;
        }
      }

      console.log("Form checks complete.");
      addUser();

      console.log("Submission complete.");
      // All other checks passed
      setSubmitted(true);
      setError(undefined);
    }
  };

  return (
    <>
      <Head>
        <title>SciREN: Register an Account</title>
        <meta name="description" content="SciREN Profile Signup" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1>SciREN - Signup</h1>
        <form className={styles.loginForm}>
          {/* First name */}
          <label className={styles.loginLabel}>First Name</label>
          <input
            onChange={handleField(setFirstName)}
            required
            className={styles.formInput}
            value={firstName}
            type="text"
          />
          {/* Last name */}
          <label className={styles.loginLabel}>Last Name</label>
          <input
            onChange={handleField(setLastName)}
            required
            className={styles.formInput}
            value={lastName}
            type="text"
          />
          {/* User type */}
          <label className={styles.loginLabel}>User Type</label>
          <select
            name="selectList"
            id="selectList"
            onChange={handleField(setUserType)}
            className={styles.formInput}
          >
            <option value="researcher">Researcher</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
            <option value="admin">Administrator</option>
          </select>
          {/* Academic interests */}
          <label className={styles.loginLabel}>
            Academic Interests: Drag or use Ctrl to select multiple
          </label>
          <select
            name="selectList"
            id="selectList"
            multiple
            onChange={handleAcademicInterests}
            className={styles.formInput}
          >
            <option value="mathematics">Mathematics</option>
            <option value="biology">Biology</option>
            <option value="chemistry">Chemistry</option>
            <option value="social studies">Social Studies</option>
            <option value="history">History</option>
          </select>
          {/* Grade Range */}
          <label className={styles.loginLabel}>
            Grade Range: Drag or use Ctrl to select multiple
          </label>
          <select
            name="selectList[]"
            id="selectList[]"
            multiple
            onChange={handleGradeRange}
            className={styles.formInput}
          >
            {/* LOL GORE */}
            <option value={0}>Pre-K</option>
            <option value={1}>Kindergarten</option>
            <option value={2}>Grade 1</option>
            <option value={3}>Grade 2</option>
            <option value={4}>Grade 3</option>
            <option value={5}>Grade 4</option>
            <option value={6}>Grade 5</option>
            <option value={7}>Grade 6</option>
            <option value={8}>Grade 7</option>
            <option value={9}>Grade 8</option>
            <option value={10}>Grade 9</option>
            <option value={11}>Grade 10</option>
            <option value={12}>Grade 11</option>
            <option value={13}>Grade 12</option>
            <option value={14}>College</option>
          </select>
          {/* Email */}
          <label className={styles.loginLabel}>Email</label>
          <input
            onChange={handleField(setEmail)}
            required
            className={styles.formInput}
            value={email}
            type="text"
          />
          {/* Password */}
          <label className={styles.loginLabel}>Password</label>
          <input
            onChange={handleField(setPassword)}
            required
            className={styles.formInput}
            value={password}
            type="password"
          />
          {/* Verify Password */}
          <label className={styles.loginLabel}>Verify Password</label>
          <input
            onChange={handleField(setVerifyPassword)}
            required
            className={styles.formInput}
            value={verifyPassword}
            type="password"
          />
          {/* Submit */}
          <button
            onClick={handleSubmit}
            className={styles.loginSubmit}
            type="submit"
          >
            Submit
          </button>

          {error && <p className={styles.error}>{error}</p>}
          {/* TODO: Add message for successful submission */}
        </form>
      </div>
    </>
  );
};

export default Register;
