import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAFUS4-wgstOuxpFj_NSCgTl2KkpqT4IRs",
    authDomain: "ecommerce2021-642ee.firebaseapp.com",
    projectId: "ecommerce2021-642ee",
    storageBucket: "ecommerce2021-642ee.appspot.com",
    messagingSenderId: "881112879504",
    appId: "1:881112879504:web:044d2f0ae65d7e3db0a315"
};
// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
