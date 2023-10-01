// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyA0KyUEJHxYPnW6iI_7ZkrYBTEI3I2wyDo',
    authDomain: 'embtr-app.firebaseapp.com',
    projectId: 'embtr-app',
    storageBucket: 'embtr-app.appspot.com',
    messagingSenderId: '376803163073',
    appId: '1:376803163073:web:a2c37ecd054cdc7321cd40',
    measurementId: 'G-RFPXMMXKY7',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Needed to persist logins over multiple app restarts
initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export default firebaseApp;
