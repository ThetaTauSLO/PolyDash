import { FirebaseAuth } from "../../components/FirebaseAuth/firebase";
import { log, SIGN_IN, getClientIp, SIGN_OUT, UPDATE_USERNAME, UPDATE_RESUME } from '../log';

export const userSignIn = (callback) => {
    var dt = new Date();
    const Firestore = FirebaseAuth.firestore();
    const currentUser = FirebaseAuth.auth().currentUser;
    
    const userDocRef = Firestore.collection('users').doc(currentUser.uid);
    userDocRef.get().then(doc => {
        if(doc.exists){
            // update user document
            userDocRef.set({
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                lastLoginTime: dt
            },{merge: true}).then(() => {
                
                callback(true);
            }).catch(err => {
                console.log(err);
                callback(false);
            });
        }else{
            // create user document
            userDocRef.set({
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                creationTime: dt,
                lastLoginTime: dt
            }).then(() => {
                callback(true);
            }).catch(err => {
                console.log(err);
                callback(false);
            });
        }
    });
    getClientIp().then(function(ipAddr){
        log(SIGN_IN + ipAddr);
    });
    
}

export const userSignOut = () => {
    getClientIp().then(function(ipAddr){
        log(SIGN_OUT + ipAddr, (result) => {
            // wait for log is successfully written before signing out
            if(result){
                FirebaseAuth.auth().signOut();
            }
        });
    });   
}

export const userUpdateName = () => {
    const Firestore = FirebaseAuth.firestore();
    const currentUser = FirebaseAuth.auth().currentUser;

    const userDocRef = Firestore.collection('users').doc(currentUser.uid);
    userDocRef.set({
        displayName: currentUser.displayName
    },{merge: true});
    log(UPDATE_USERNAME);
}
export const userUpdateResume = (newResumeURL, newResumeID) => {
    const Firestore = FirebaseAuth.firestore();
    const currentUser = FirebaseAuth.auth().currentUser;

    const userDocRef = Firestore.collection('users').doc(currentUser.uid);
    userDocRef.set({
        resumeURL: newResumeURL,
        resumeID: newResumeID
    },{merge: true});
    log(UPDATE_RESUME);
}

export const userGetResume = async () => {
    const Firestore = FirebaseAuth.firestore();
    const currentUser = FirebaseAuth.auth().currentUser;

    const userDocRef = Firestore.collection('users').doc(currentUser.uid);
    return userDocRef.get();
    // await userDocRef.get().then((doc) => {
    //     if (doc.exists && (doc.data()['resumeURL'] !== "" && doc.data()['resumeURL'] !== undefined)) {
    //         console.log("Found resume:",  doc.data()['resumeURL']);
    //         return (doc.data()['resumeURL']);
    //     } else {
    //         // doc.data() will be undefined in this case
    //         return ("No Resume Uploaded");
    //     }
    // }).catch((error) => {
    //     console.error(error);
    //     return("Error getting resume URL");
    // });
}