import React, { useState } from "react";
import { Link } from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { FirebaseAuth } from '../FirebaseAuth/firebase';
import firebase from "firebase/app";
import { userSignIn } from '../../libs/user';
import Loader from "../Loader";
import Logo from "../Logo";
import { setCookie, getCookie, checkCookie } from "../CookieHelper";
import { default as CalPolyLogo } from "../Logo/calpoly_logo.svg"

const FirebaseUI = () => {

    const params = (new URL(document.location)).searchParams;
    const re = params.get('re');
    if(re && re.indexOf('/') === 0){
        localStorage.setItem('re', re);
    }

    const [signInSuccess, setSignInSuccess] = useState(null);

    console.log("FirebaseUI Login Logo Select: ", CalPolyLogo);
    // Configure FirebaseUI.
    const uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                console.log("authResult: " + JSON.stringify(authResult));
                console.log("redirectUrl: ", redirectUrl);
                console.log("oauthIdToken: " + authResult.credential.idToken);
                console.log("oauthAccessToken: " + authResult.credential.accessToken);
                if (authResult.credential.accessToken !== undefined) {
                    setCookie("msoauthAccessToken", authResult.credential.accessToken, 365);
                    setCookie("msoauthIdToken", authResult.credential.idToken, 365);
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
                        setSignInSuccess(false);
                    }
                })
                return false;
            },
            uiShown: function(){
                document.getElementById('loader').style.display = 'none';
            }
        },
        signInSuccessUrl: '/',
        signInOptions: [
            // firebase.auth.EmailAuthProvider.PROVIDER_ID,
            // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            {
                provider: "microsoft.com",
                customParameters: {
                    prompt: "consent",
                    tenant: "1b0d02db-fc9e-4495-9537-1d379cca2ae7",
                },
                fullLabel: "Sign in with Cal Poly SSO",
                iconUrl: CalPolyLogo,
                scopes: [
                    'https://graph.microsoft.com/email',
                    // 'https://graph.microsoft.com/Files.ReadWrite.All',
                    'https://graph.microsoft.com/Files.ReadWrite.AppFolder',
                    'https://graph.microsoft.com/offline_access',
                    'https://graph.microsoft.com/openid',
                    'https://graph.microsoft.com/profile',
                    'https://graph.microsoft.com/User.Read',
                    'https://graph.microsoft.com/Calendars.ReadWrite.Shared'
                ]
              },
        ]
    };

    return (
        <>
        {signInSuccess &&
            <Loader />
        }
        {signInSuccess === null &&
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

export default FirebaseUI;