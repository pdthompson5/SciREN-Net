import React from "react";
import styles from "@/styles/Form.module.css";
import {TextField, Autocomplete, AutocompleteRenderInputParams} from "formik-mui"
import {Alert, Button, TextField as MaterialTextField, Tooltip} from "@mui/material"
import { Field } from "formik";
import { regionOptions, userTypes } from "@/pages/edit-profile";

const capitalizeField = (field: string) => {
    const words = field.includes(" ") ? field.split(" "): [field]
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

export const AcademicInterests = (props: {academicInterestOptions: string[], label: string, freeSolo: boolean}) => {
    return (
    <Field 
        name="academicInterest"
        component={Autocomplete}
        className={styles.inputBorder}
        label={props.label}
        options={props.academicInterestOptions}
        multiple
        freeSolo={props.freeSolo}
        renderInput={(params: AutocompleteRenderInputParams) => (
          <MaterialTextField
            {...params}
            className={styles.formInput}
            name="academicInterest"
            label={props.label}
            variant="outlined"
          />
        )}
    />
    )
}

export const GradeRange = (props: {gradeRangeOptions: string[]}) => {
    return ( 
    <Field 
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
    />
    )
}

// TODO: Figure out a way to indicate to the user that they can add their own options
// TODO: Why are entries being deleted when I click in and out?
export const Organization = (props: {organizationOptions: string[]} ) => {
    return (
        // TODO: Tooltip should only pop up when typing
        <Tooltip disableHoverListener disableFocusListener title="Press enter to add new organizations if yours is not listed">
            <Field 
                name="organizations"
                component={Autocomplete}
                className={styles.inputBorder}
                label="Organization(s)"
                options={props.organizationOptions}
                freeSolo
                multiple
                renderInput={(params: AutocompleteRenderInputParams) => (
                <MaterialTextField
                    {...params}
                    className={styles.formInput}
                    name="organizations"
                    label="Organization(s)"
                    variant="outlined"
                />
                )}
            />
        </Tooltip>
        )
}

export const Position = () => {
    return (
        <div className={styles.inputBorder}>
            <Field name="position" component={TextField} className={styles.formInput} type="text" label="Position(s) at Organization(s)"/>
        </div>
    )
}

export const SciRENRegion = (props: {regionOptions: string[]}) => {
   return (
        <Field 
        name="scirenRegion"
        component={Autocomplete}
        className={styles.inputBorder}
        label="SciREN Region"
        options={props.regionOptions}
        renderInput={(params: AutocompleteRenderInputParams) => (
            <MaterialTextField
                {...params}
                className={styles.formInput}
                name="scirenRegion"
                label="SciREN Region"
                variant="outlined"
            />
        )}
        >
        </Field>
   )
}

export const TextBio = () => {
    return (
        <div className={styles.inputBorder}>
            <Field name="textBio" component={TextField} className={styles.formInput} multiline type="text" label="About You"/>
        </div>
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
