import { Providers, SimpleProvider, ProviderState } from '@microsoft/mgt-element';
import React, { useEffect, useState, useContext } from "react";
import { MsalProvider } from '@microsoft/mgt-msal-provider';
import { getCookie } from '../CookieHelper';
// import { AuthContext } from '../FirebaseAuth';
import { getProfileBase64, getAccessToken } from '../MicrosoftAuth/graph.js';

const MicrosoftAuth = () => {

  // const { userData, setUserData } = useContext(AuthContext);
  // Providers.globalProvider = new MsalProvider({
  //   clientId: '1c97ea9d-a07b-4b1a-8f53-117958f2b834',
  //   authority: 'https://login.microsoftonline.com/1b0d02db-fc9e-4495-9537-1d379cca2ae7'
  // });

  function getAccessToken(scopes) {
    // return a promise with accessToken string
    let aToken = getCookie("msoauthAccessToken");
    // console.log("getAccessToken: ", aToken);
    return aToken;
  }
  
  function login() {
    //login code
    Providers.globalProvider.setState(ProviderState.SignedIn)
  }
  
  function logout() {
    // logout code
  }

  // async function checkProfilePhotoURL() {
  //   let accessToken = getAccessToken();
  //   console.log("got access");
  //   if (accessToken != undefined) {
  //     const profileURL = await getProfileBase64(getAccessToken());
  //     console.log("got profileURL");
  //     setUserData({
  //         'photoURL': "data:image/jpeg;base64," + profileURL
  //     });
  //   }
  //   console.log("new userData: ", userData);
  // }
  
  Providers.globalProvider = new SimpleProvider(getAccessToken, login, logout);
  console.log("provider config", Providers.globalProvider);
  // checkProfilePhotoURL();
  
}



export default MicrosoftAuth;