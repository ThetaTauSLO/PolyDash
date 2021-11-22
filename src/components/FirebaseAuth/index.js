import React, { useEffect, useState } from "react";
import { FirebaseAuth } from "./firebase";
import { getProfileBase64, getAccessToken } from '../MicrosoftAuth/graph.js';
import MicrosoftAuth from "../MicrosoftAuth";
export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState({
      'user': null,
      'checked': false,
      'photoURL': null
    });

    const [userData, setUserData] = useState({

    })
  
    useEffect(() => {
      async function checkProfilePhotoURL() {
          let accessToken = getAccessToken();
          console.log("got access");
          if (accessToken !== undefined && accessToken !== "") {
            const profileURL = await getProfileBase64(accessToken);
            console.log("got profileURL");
            setUserData({
              'photoURL': "data:image/jpeg;base64," + profileURL
            });
          }
      }
      FirebaseAuth.auth().onAuthStateChanged(function(user){
        if(user !== null){
          user.getIdToken().then(token => {
            setAuthUser({
              'user': user,
              'checked': true,
              'photoURL': null
            });
            MicrosoftAuth();
            checkProfilePhotoURL();
          });
        }else{
          setAuthUser({
            'user': null,
            'checked': true,
            'photoURL': null
          });
        }
      });
    }, []);
  
    return (
      <AuthContext.Provider
        value={{
          authUser, userData, setUserData
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };