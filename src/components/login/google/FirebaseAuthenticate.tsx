import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential, getAuth } from "firebase/auth";
import { AuthSessionResult } from 'expo-auth-session';
import { GoogleAuthenticate } from 'src/components/login/google/GoogleAuthenticate';

WebBrowser.maybeCompleteAuthSession();

interface Props {
    buttonText: string,
    callback: Function
}

export const FirebaseAuthenticate = ({ buttonText, callback }: Props) => {

    const onLoginResponse = (response: AuthSessionResult) => {
        if (response.type === 'success') {
            const { authentication } = response;
            const { idToken, accessToken } = authentication!;

            const credential = GoogleAuthProvider.credential(idToken, accessToken);

            //auth with firebase specifically
            signInWithCredential(getAuth(), credential).then(userCredential => {
                callback(userCredential);
            });
        }
    }

    return <GoogleAuthenticate buttonText={buttonText} callback={onLoginResponse} />
}