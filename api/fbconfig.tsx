import * as React from 'React';
import firebase from 'firebase/app';
import 'firebase/database';
// Optionally import the services that you want to use
//import "firebase/auth";
//import "firebase/firestore";
//import "firebase/functions";
//import "firebase/storage";

const firebaseConfig = {
  apiKey: 'AIzaSyBNmfl0uUncNIpeez_YbUZQK2uWM-89yPo',
  authDomain: 'mobeng-f4f9b.firebaseapp.com',
  databaseURL:
    'https://mobeng-f4f9b-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'mobeng-f4f9b',
  storageBucket: 'mobeng-f4f9b.appspot.com',
  messagingSenderId: '518908350029',
  appId: '1:518908350029:web:9bdcb00ee3081628081604',
  measurementId: 'G-X2XMRVR457',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();

export { firebase, database };
