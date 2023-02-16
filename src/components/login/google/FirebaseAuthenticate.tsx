import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential, getAuth } from 'firebase/auth';
import { AuthSessionResult } from 'expo-auth-session';
import { GoogleAuthenticate } from 'src/components/login/google/GoogleAuthenticate';

WebBrowser.maybeCompleteAuthSession();

interface Props {
    buttonText: string;
}

export const FirebaseAuthenticate = ({ buttonText }: Props) => {
    const onLoginResponse = (response: AuthSessionResult) => {
        if (response.type === 'success') {
            const { authentication } = response;
            const { idToken, accessToken } = authentication!;

            const credential = GoogleAuthProvider.credential(idToken, accessToken);

            //auth with firebase specifically
            signInWithCredential(getAuth(), credential);
        }
    };

    return <GoogleAuthenticate buttonText={buttonText} callback={onLoginResponse} />;
};
