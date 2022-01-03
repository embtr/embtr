import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { TouchableOpacity, ViewStyle, Text, TextStyle, View, Image } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useAppDispatch } from 'src/redux/hooks';
import { createUserObject, setUser, User } from "src/redux/user/UserSlice";
import { GoogleAuthProvider, signInWithCredential, getAuth, UserCredential } from "firebase/auth";
import AuditLogDao from 'src/firebase/firestore/audit_log/AuditLogDao';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignIn() {
    const { colors } = useTheme();

    const containerStyle = {
        margin: 24,
        padding: 12,
        width: 220,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.primary,
        alignContent: "center",
        alignItems: "center"
    } as ViewStyle;

    const logoViewStyle = {
        justifyContent: "center",
        alignItems: "center",
        paddingRight: 10
    } as ViewStyle;

    const textStyle = {
        fontSize: 18,
        color: colors.text,
    } as TextStyle;

    const dispatch = useAppDispatch();

    const [request, response, promptAsync] = Google.useAuthRequest(
        {
            expoClientId: '376803163073-nivsntdkkej9ltf8lm7o46u1m2o63hcg.apps.googleusercontent.com',
            iosClientId: '376803163073-8pb7iligkf6p5ea4roucb23fe8v857r8.apps.googleusercontent.com',
            androidClientId: '376803163073-dn4cpjpj65nn3fm5e2f6r6hqc5hp7agf.apps.googleusercontent.com',
            webClientId: '376803163073-qle8k2tk1phjd3mmatmdknvafnivgcba.apps.googleusercontent.com',
        }
    );

    const storeUserCredential = (userCredential: UserCredential) => {
        const { uid, displayName, email, photoURL } = userCredential.user;
        const user: User = createUserObject(uid!, displayName!, email!, photoURL!);
        dispatch(setUser(user));
    };

    //post google auth
    React.useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            const { idToken, accessToken } = authentication!;

            const credential = GoogleAuthProvider.credential(idToken, accessToken);
            //auth with firebase specifically
            signInWithCredential(getAuth(), credential).then(userCredential => {
                storeUserCredential(userCredential);
                AuditLogDao.addLog("login");
            });
        }
    }, [response]);

    return (
        <TouchableOpacity style={containerStyle} onPress={() => { promptAsync() }}>
            <View style={{ flexDirection: "row" }}>
                <View style={[logoViewStyle, { flex: 1 }]}>
                    <Image source={require('assets/google_logo.png')} style={{ width: 18, height: 18 }} />
                </View>
                <Text style={[textStyle, { flex: 9 }]}>Login With Google</Text>
            </View>
        </TouchableOpacity>
    );
}