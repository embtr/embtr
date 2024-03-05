import { View } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { OAuthProvider, getAuth, signInWithCredential } from 'firebase/auth';
import { useAppDispatch } from 'src/redux/Hooks';
import { setAppleAuthUserInfo } from 'src/redux/user/GlobalState';
import { DEFAULT_APPLE_AUTH_USER_INFO } from 'src/model/GlobalState';

export const AppleAuthenticate = () => {
    const dispatch = useAppDispatch();

    return (
        <View>
            <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
                cornerRadius={5}
                style={{
                    height: '100%',
                    width: '100%',
                }}
                onPress={async () => {
                    try {
                        const nonce = Math.random().toString(36).substring(2, 10);
                        return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce)
                            .then((hashedNonce) =>
                                AppleAuthentication.signInAsync({
                                    requestedScopes: [
                                        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                                        AppleAuthentication.AppleAuthenticationScope.EMAIL,
                                    ],
                                    nonce: hashedNonce,
                                })
                            )
                            .then(async (appleCredential) => {
                                const appleAuthUserInfo = appleCredential.fullName;
                                dispatch(setAppleAuthUserInfo(appleAuthUserInfo));

                                const { identityToken } = appleCredential;
                                const provider = new OAuthProvider('apple.com');
                                const credential = provider.credential({
                                    idToken: identityToken!,
                                    rawNonce: nonce,
                                });
                                signInWithCredential(getAuth(), credential);
                                // Successful sign in is handled by firebase.auth().onAuthStateChanged
                            })
                            .catch((error) => {
                                dispatch(setAppleAuthUserInfo(DEFAULT_APPLE_AUTH_USER_INFO));
                                // ...
                            });

                        // signed in
                    } catch (e: any) {
                        if (e.code === 'ERR_REQUEST_CANCELED') {
                            // handle that the user canceled the sign-in flow
                        } else {
                            // handle other errors
                        }
                    }
                }}
            />
        </View>
    );
};
