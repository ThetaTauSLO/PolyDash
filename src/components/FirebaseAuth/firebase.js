import firebase from "firebase/app";
import 'firebase/firestore';
import "firebase/auth";
import "firebase/functions";
const config = JSON.parse(process.env.REACT_APP_FIREBASE);

const FirebaseAuth = firebase.initializeApp(config);
const Firestore = FirebaseAuth.firestore();
const CloudFunctions = FirebaseAuth.functions();

export {FirebaseAuth, Firestore, CloudFunctions}