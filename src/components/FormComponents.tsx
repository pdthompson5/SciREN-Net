import React from "react";
import styles from "@/styles/Form.module.css";

import {TextField, Autocomplete, AutocompleteRenderInputParams} from "formik-mui"
import {Alert, Button, TextField as MaterialTextField} from "@mui/material"
import { Field} from "formik";

const capitalizeField = (field: string) => {
    const words = field.split(" ");
    return words.map((word) => { 
        return word[0].toUpperCase() + word.substring(1); 
    }).join(" ");
}


export type FormStatus = {
    severity: "error" | "warning" | "info" | "success";
    message: string;
}

export const UserType = (props: {userTypes: string[]}) => {
    return (
        <Field 
            name="userType"
            component={Autocomplete}
            className={styles.inputBorder}
            label="User Type"
            options={props.userTypes}
            getOptionLabel={(option: string) => capitalizeField(option)}
            renderInput={(params: AutocompleteRenderInputParams) => (
            <MaterialTextField
                {...params}
                className={styles.formInput}
                name="userType"
                label="User Type"
                variant="outlined"
            />
            )}
            >
        </Field>
    )
}


export const Temp = (props: {userTypes: string[]}) => {
    return (
        <MaterialTextField sx={{
            padding: "20px"

        }} >

        </MaterialTextField>
    )
}

export const FirstName = () => {
    return (
        <div className={styles.inputBorder}>
            <Field name="firstName" component={TextField} className={styles.formInput} type="text" label="First Name"/>
        </div>
    )
}

export const LastName = () => {
    return (
        <div className={styles.inputBorder}>
            <Field name="lastName" component={TextField} className={styles.formInput} type="text" label="Last Name"/>
        </div>
    )
}

export const AcademicInterests = (props: {academicInterestOptions: string[]}) => {
    return (
        <Field 
        name="academicInterest"
        component={Autocomplete}
        className={styles.inputBorder}
        label="Academic Interests"
        options={props.academicInterestOptions}
        multiple
        getOptionLabel={(option: string) => capitalizeField(option)}
        renderInput={(params: AutocompleteRenderInputParams) => (
          <MaterialTextField
            {...params}
            className={styles.formInput}
            name="academicInterest"
            label="Academic Interests"
            variant="outlined"
          />
        )}
        >
        </Field>
    )
}


export const GradeRange = (props: {gradeRangeOptions: string[]}) => {
    return ( <Field 
        name="gradeRange"
        component={Autocomplete}
        className={styles.inputBorder}
        label="Grade Range"
        options={props.gradeRangeOptions.map((x, i) => i)}
        getOptionLabel={(option: number) => props.gradeRangeOptions[option]}
        multiple
        renderInput={(params: AutocompleteRenderInputParams) => (
        <MaterialTextField
            {...params}
            className={styles.formInput}
            name="gradeRange"
            label="Grade Range"
            variant="outlined"
        />
        )}
        >
    </Field>
    )
}

export const SubmitButton = () => {
    return (
        <Button variant="contained" type="submit" className={styles.loginSubmit}>Submit</Button>
    )
}

export const Email = () => {
    return (
        <div className={styles.inputBorder}>
            <Field name="email" component={TextField} className={styles.formInput} type="text" label="Email"/>
        </div>
    )
}

export const Password = () => {
    return (
        <div className={styles.inputBorder}>
            <Field name="password" component={TextField} className={styles.formInput} type="password" label="Password"/>
        </div>
    )
}

export const VerifyPassword = () => {
    return (
        <div className={styles.inputBorder}>
            <Field name="verifyPassword" className={styles.formInput} component={TextField} type="password" label="Verify Password"/>
        </div>
    )
}



export const StatusAlert = (props: {status: FormStatus}) => {
    return (
        props.status ? 
        <Alert severity={props.status.severity} sx={{marginBottom: "10px"}}>{props.status.message}</Alert>
        :<span>&nbsp;&nbsp;&nbsp;</span>
    )
}
