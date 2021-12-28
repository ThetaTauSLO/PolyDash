import React, { useState } from "react";
import { Link } from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { FirebaseAuth } from '../FirebaseAuth/firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { userSignIn } from '../../libs/user';
import Loader from "../Loader";
import Logo from "../Logo";
import { setCookie, deleteCookie } from "../CookieHelper";
import { default as CalPolyLogo } from "../Logo/calpoly_logo.svg"
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

function checkCookieEnabled() {
    if (navigator.cookieEnabled) return true;

    // set and read cookie
    document.cookie = "cookietest=1";
    var ret = document.cookie.indexOf("cookietest=") !== -1;

    // delete cookie
    document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";

    return ret;
}
const FirebaseUIAlt = () => {
    const [cookieError, setCookieError] = useState(false);
    const [signInSuccess, setSignInSuccess] = useState(null);
    const params = (new URL(document.location)).searchParams;
    const re = params.get('re');

    let isCookieEnabled = checkCookieEnabled();
    let uiConfig;
    if (!isCookieEnabled && !cookieError) {
        console.error("Cookie is not enabled. Unable to store oauth tokens!");
        setCookieError(true);
    }
    else if (!cookieError) {
        if(re && re.indexOf('/') === 0){
            localStorage.setItem('re', re);
        }

        console.log("FirebaseUIAlt Login Logo Select: ", CalPolyLogo);
        // Configure FirebaseUIAlt.
        uiConfig = {
            callbacks: {
                signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                    console.log("authResult: " + JSON.stringify(authResult));
                    console.log("redirectUrl: ", redirectUrl);
                    if (authResult !== undefined && authResult.credential !== undefined && authResult.credential !== null) {
                      console.log("signInMethod: ", authResult.credential.signInMethod);
                      console.log("oauthIdToken: " + authResult.credential.idToken);
                      console.log("oauthAccessToken: " + authResult.credential.accessToken);
                      if (authResult.credential.accessToken !== undefined && authResult.credential.accessToken !== null && authResult.credential.signInMethod === "microsoft.com") {
                        setCookie("msoauthAccessToken", authResult.credential.accessToken, 365);
                        setCookie("msoauthIdToken", authResult.credential.idToken, 365);
                      }
                      else {
                        console.log("No valid microsoft oauth credential. Clearing existing microsoft oauth credentials.");
                        deleteCookie("msoauthAccessToken");
                        deleteCookie("msoauthIdToken");
                      }
                      setCookie("signInMethod", authResult.credential.signInMethod, 365);
                    }
                    else {
                      console.log("Unable to get accessToken!");
                    }


                    // debugger;

                    userSignIn((result) => {
                        if(result){
                            setSignInSuccess(true);
                            const to = localStorage.getItem('re');
                            localStorage.removeItem('re');
                            if(to && to.indexOf('/') === 0){
                                window.location = to;
                            }else{
                                window.location = '/';
                            }
                        }else{
                          console.warn("Sign in success set to FALSE");
                            setSignInSuccess(false);
                        }
                    })
                console.warn("Sign in returned FALSE to callback");
                    return false;
                },
                uiShown: function(){
                    document.getElementById('loader').style.display = 'none';
                }
            },
            signInFlow: 'popup',
            signInSuccessUrl: '/',
            signInOptions: [
                // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
              firebase.auth.EmailAuthProvider.PROVIDER_ID,
              {
                provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                scopes: [
                  // "https://www.googleapis.com/auth/calendar.events.readonly",

                ],
              },

            ]
        };
    }





    return (
        <>
        <div>
        <Modal
            open={cookieError}
            aria-labelledby="Please Enable Cookie Support"
            aria-describedby="This site is inaccessible without enabling cookies. See https://www.whatismybrowser.com/guides/how-to-enable-cookies/auto"
        >
            <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Fatal Application Error: Unable to store oauth tokens.
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Please enable cookie support on your browser using <a href="https://www.whatismybrowser.com/guides/how-to-enable-cookies/auto">this article</a>
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                We are unable to store your authentication credentials without cookie and LocalStorage support.
            </Typography>
            </Box>
        </Modal>
        </div>
        {signInSuccess &&
            <Loader />
        }
        {cookieError === false && signInSuccess === null &&
            <>
                <div id="sign-in" className="SignIn">
                    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={FirebaseAuth.auth()} />
                </div>
                <div id="loader">
                    <Loader />
                </div>
            </>
        }
        {signInSuccess === false &&
            <div className="text-center">
                <Logo size="80px" />
                <h1>Server Error</h1>
                <p>Oops, something went wrong, please try again.</p>
                <Link to="/">Home</Link>
            </div>
        }
        </>
    );
}

export default FirebaseUIAlt;
