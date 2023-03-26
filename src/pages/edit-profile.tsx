import React, { useState } from "react";
import Head from "next/head";
import styles from "@/styles/Form.module.css";
import { User, PostUserRequest, PostUserResponse } from "./api/user";
import { useRouter, Router } from "next/router";
import { useFormik, Field, Form, Formik, FormikProps} from "formik";

import { validatePassword, validateEmail } from "./register";
import useUser from "@/lib/useUser";


/* Registration Page */
//TODO: Apply templated handlers
//TODO: Template academic interest form elements

const capitalizeField = (field: string) => {
    const words = field.split(" ");
    return words.map((word) => { 
        return word[0].toUpperCase() + word.substring(1); 
    }).join(" ");
}


const EditProfile = () => {
    // TODO: Default values should be current user values
    // TODO: Make all fields required
    // TODO: styles
    const {user} = useUser((user) => "/login")
    console.log(user)


    const gradeRangeOptions = ["Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
    const academicInterestOptions = ["mathematics", "biology", "chemistry", "social studies", "history"];
    return (
        <>
            <div>
                <h1>Edit Profile</h1>
                <Formik
                    initialValues={{userType: "researcher", firstName: "", lastName: "", academicInterests: [], gradeRange: []}}
                    onSubmit={(values, actions) => {
                        setTimeout(() => {
                          alert(JSON.stringify(values, null, 2));
                          actions.setSubmitting(false);
                        }, 1000);
                      }}
                >
                    {(props: FormikProps<any>) => (
                    <Form>
                        <label htmlFor="userType">User Type</label>
                        <Field as="select" name="userType">
                            <option value="researcher">Researcher</option>
                            <option value="teacher">Teacher</option>
                            <option value="student">Student</option>
                            <option value="admin">Administrator</option>
                        </Field>

                        <label htmlFor="firstName">First Name</label>
                        <Field type="text" name="firstName" placeholder="First Name" />

                        <label htmlFor="lastName">Last Name</label>
                        <Field type="text" name="lastName" placeholder="Last Name" />

                        {/* TODO: I think that checkboxes would probably be better? Perhaps, not sure */}
                        <label htmlFor="academicInterests">Academic Interests</label>
                        <Field as = "select" name="academicInterests" multiple>
                            {academicInterestOptions.map((interest, index) => <option key={index} value={interest}>{capitalizeField(interest)}</option>)}
                        </Field>

                        <label htmlFor="gradeRange">Grade Range</label>
                        <Field as = "select" name="gradeRange" multiple>
                            {gradeRangeOptions.map((grade, index) => <option key={index} value={index}>{grade}</option>)}
                        </Field>

                        <button type="submit">Submit</button>
                    </Form>
                    )}
                    
                </Formik>
            </div>
      </>
    )
  
};

export default EditProfile;
