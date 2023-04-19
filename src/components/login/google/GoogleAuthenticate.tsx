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
        expoClientId: '376803163073-nivsntdkkej9ltf8lm7o46u1m2o63hcg.apps.googleusercontent.com',
        iosClientId: '376803163073-8pb7iligkf6p5ea4roucb23fe8v857r8.apps.googleusercontent.com',
        androidClientId: '376803163073-dn4cpjpj65nn3fm5e2f6r6hqc5hp7agf.apps.googleusercontent.com',
        webClientId: '376803163073-qle8k2tk1phjd3mmatmdknvafnivgcba.apps.googleusercontent.com',
    });

    //post google auth
    React.useEffect(() => {
        if (response?.type === 'success') {
            callback(response);
        }
    }, [response]);

    return <GoogleLogin onPress={promptAsync} />;
};
