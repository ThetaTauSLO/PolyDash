import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/functions";
const config = JSON.parse(process.env.REACT_APP_FIREBASE);

const FirebaseAuth = firebase.initializeApp(config);
const Firestore = FirebaseAuth.firestore();
const CloudFunctions = FirebaseAuth.functions();

export {FirebaseAuth, Firestore, CloudFunctions}