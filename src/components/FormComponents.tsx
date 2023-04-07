import React from "react";
import styles from "@/styles/Form.module.css";

import {TextField, Autocomplete, AutocompleteRenderInputParams} from "formik-mui"
import {Button, TextField as MaterialTextField} from "@mui/material"
import { Field} from "formik";

const capitalizeField = (field: string) => {
    const words = field.split(" ");
    return words.map((word) => { 
        return word[0].toUpperCase() + word.substring(1); 
    }).join(" ");
}

export const UserType = (props: {userTypes: string[]}) => {
    return (
        <Field 
            name="userType"
            className={styles.formInput}
            component={Autocomplete}
            label="User Type"
            options={props.userTypes}
            getOptionLabel={(option: string) => capitalizeField(option)}
            renderInput={(params: AutocompleteRenderInputParams) => (
            <MaterialTextField
                {...params}
                name="userType"
                label="User Type"
                variant="outlined"
            />
            )}
            >
        </Field>
    )
}

export const FirstName = () => {
    return (
        <div className={styles.formInput}>
            <Field name="firstName" className={styles.formInput} component={TextField} type="text" label="First Name"/>
        </div>
    )
}

export const LastName = () => {
    return (
        <div className={styles.formInput}>
            <Field name="lastName" className={styles.formInput} component={TextField} type="text" label="Last Name"/>
        </div>
    )
}

export const AcademicInterests = (props: {academicInterestOptions: string[]}) => {
    return (
        <Field 
        name="academicInterest"
        className={styles.formInput}
        component={Autocomplete}
        label="Academic Interests"
        options={props.academicInterestOptions}
        multiple
        getOptionLabel={(option: string) => capitalizeField(option)}
        renderInput={(params: AutocompleteRenderInputParams) => (
          <MaterialTextField
            {...params}
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
        className={styles.formInput}
        component={Autocomplete}
        label="Grade Range"
        options={props.gradeRangeOptions.map((x, i) => i)}
        getOptionLabel={(option: number) => props.gradeRangeOptions[option]}
        multiple
        renderInput={(params: AutocompleteRenderInputParams) => (
        <MaterialTextField
            {...params}
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
        <Field name="email" className={styles.formInput} component={TextField} type="text" label="Email"/>
    )
}

export const Password = () => {
    return (
        <Field name="password" className={styles.formInput} component={TextField} type="password" label="Password"/>
    )
}

