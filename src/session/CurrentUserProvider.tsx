import * as React from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const registerAuthStateListener = (callback:Function) => {
    onAuthStateChanged(getAuth(), (user) => {
        callback(user);
    });
    return undefined;
}