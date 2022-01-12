import * as React from 'react';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

export const registerAuthStateListener = (callback: Function) => {
    onAuthStateChanged(getAuth(), (user) => {
        callback(user);
    });
}

export const getCurrentUserUid = (callback: Function) => {
    const user : User | null = getAuth().currentUser;
    if (user) {
        callback(user.uid);
    } else {
        registerAuthStateListener((user: User) => {
            callback(user.uid);
        });
    }
}