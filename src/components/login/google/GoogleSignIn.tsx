import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { UserCredential } from "firebase/auth";
import AuditLogController from 'src/controller/audit_log/AuditLogController';
import { FirebaseAuthenticate } from 'src/components/login/google/FirebaseAuthenticate';

WebBrowser.maybeCompleteAuthSession();

export const GoogleSignIn = () => {
    const onLoginResponse = () => {
        AuditLogController.addLog("login");
    };

    return <FirebaseAuthenticate buttonText="Login With Google" callback={onLoginResponse} />
}