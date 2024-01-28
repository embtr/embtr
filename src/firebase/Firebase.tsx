import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const productionFirebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_WEB_API,
    authDomain: 'embtr-app.firebaseapp.com',
    projectId: 'embtr-app',
    storageBucket: 'embtr-app.appspot.com',
    messagingSenderId: '376803163073',
    appId: '1:376803163073:web:a2c37ecd054cdc7321cd40',
    measurementId: 'G-RFPXMMXKY7',
};

const developmentFirebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_WEB_API,
    authDomain: 'embtr-development.firebaseapp.com',
    projectId: 'embtr-development',
    storageBucket: 'embtr-development.appspot.com',
    messagingSenderId: '1023290678491',
    appId: '1:1023290678491:web:5c40b411d16cf4b7dac0fe',
    measurementId: 'G-JSXDNEXMLQ',
};

const firebaseConfig =
    process.env.APP_ENV === 'development' || process.env.EXPO_PUBLIC_ENV === 'development'
        ? developmentFirebaseConfig 
        : productionFirebaseConfig;
const firebaseApp = initializeApp(firebaseConfig);
getFirestore(firebaseApp);

// Needed to persist logins over multiple app restarts
initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export default firebaseApp;
