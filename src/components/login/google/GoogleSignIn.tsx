import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useAppDispatch } from 'src/redux/hooks';
import { createUserObject, setUser, User } from "src/redux/user/UserSlice";
import { UserCredential } from "firebase/auth";
import AuditLogController from 'src/controller/audit_log/AuditLogController';
import { FirebaseAuthenticate } from 'src/components/login/google/FirebaseAuthenticate';

WebBrowser.maybeCompleteAuthSession();

export const GoogleSignIn = () => {
    const dispatch = useAppDispatch();

    const storeUserCredential = (userCredential: UserCredential) => {
        const { uid, displayName, email, photoURL } = userCredential.user;
        const user: User = createUserObject(uid!, displayName!, email!, photoURL!);

        dispatch(setUser(user));
    };

    const onLoginResponse = (userCredential: UserCredential) => {
        storeUserCredential(userCredential);
        AuditLogController.addLog("login");
    };

    return <FirebaseAuthenticate buttonText="Login With Google" callback={onLoginResponse} />
}