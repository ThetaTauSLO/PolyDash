import React from "react";
import FirebaseUIAlt from '../../../components/FirebaseUI/alternate';
import Logo from "../../../components/Logo";
import {Alert, AlertTitle, Container, Divider, Grid, Tooltip } from "@mui/material";

const SignInOther = () => {

    return (
        <Container>
            <div className="text-center">
            <Logo size="80px" />
            <h2 className="h3 mb-3 font-weight-normal">Please sign in (External Partners)</h2>
            <div className="card-body">
            <FirebaseUIAlt />
            </div>
            <p>Cal Poly affiliated member? <a href="signin">Click here.</a></p>

        </div>
        <Divider sx={{ m: 2 }}/>
        <Alert severity="info">
        <AlertTitle>Getting Started With Cal Poly HKN</AlertTitle>
            Log in using your Cal Poly credentials. Your authentication keys are stored locally.
        </Alert>
        <Divider sx={{ m: 2 }}/>
        <Alert severity="info">
        <AlertTitle sx={{ pb: 1 }}>You must grant
            the following permissions for the application:</AlertTitle>
            <Grid container spacing={2} columns={2}>
                <Grid container>
                    <Grid item xs>
                        <p align="left">
                            Sign you in and read your profile
                        </p>
                    </Grid>
                    <Grid item xs>
                        <p align="left">
                            This allows the application to retrieve your avatar, name, email, Cal Poly, and organization affiliation status.
                        </p>
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid item xs>
                        <p align="left">
                            Have full access to your files
                        </p>
                    </Grid>
                    <Grid item xs>
                        <p align="left">
                            This permission is used to allow you to upload files, such as resume, from your Cal Poly account.
                            All file operations are sandboxed to this application, and no files are read except for files you
                            explicitly select.
                        </p>
                    </Grid>
                </Grid>
                {/* <Grid container>
                    <Grid item xs>
                        <p align="left">
                            Maintain access to data you have given it access to
                        </p>
                    </Grid>
                    <Grid item xs>
                        <p align="left">
                            This allows the service to retain access to files you have explicitly uploaded, even after you have logged out.
                        </p>
                    </Grid>
                </Grid> */}
            </Grid>
        </Alert>
        <Divider sx={{ m: 2 }}/>
        <Tooltip title={<a href="https://github.com/EnumC/CalPolyHKN/tree/dashboard" style={{color:"#ffffff"}}>https://github.com/EnumC/CalPolyHKN/tree/dashboard</a>} enterDelay={0} leaveDelay={5000}>
        <u>Source Code</u>
        </Tooltip>
        </Container>

    )
}

export default SignInOther;
