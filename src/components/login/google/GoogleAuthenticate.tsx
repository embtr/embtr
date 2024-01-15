import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleLogin } from 'src/components/landing/GoogleLogin';

WebBrowser.maybeCompleteAuthSession();

interface Props {
    buttonText: string;
    callback: Function;
}

export const GoogleAuthenticate = ({ buttonText, callback }: Props) => {
    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: process.env.EXPO_PUBLIC_AUTH_EXPO_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_AUTH_IOS_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_AUTH_ANDROID_CLIENT_ID,
    });

    //post google auth
    React.useEffect(() => {
        if (response?.type === 'success') {
            callback(response);
        }
    }, [response]);

    return <GoogleLogin onPress={promptAsync} />;
};
