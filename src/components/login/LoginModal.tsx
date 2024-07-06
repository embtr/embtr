import React from 'react';

import { Image, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import {
    POPPINS_MEDIUM,
    POPPINS_REGULAR,
    PADDING_LARGE,
    PADDING_SMALL,
    PADDING_MEDIUM,
} from 'src/util/constants';
import { EmbtrKeyboardAvoidingScrollView } from 'src/components/common/scrollview/EmbtrKeyboardAvoidingScrollView';
import { Banner } from 'src/components/common/Banner';
import { isShortDevice } from 'src/util/DeviceUtil';
import { Screen } from 'src/components/common/Screen';
import UserController from 'src/controller/user/UserController';
import { Code } from 'resources/codes';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useEmbtrRoute } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getFireConfetti, setGlobalLoading } from 'src/redux/user/GlobalState';

enum LoginResponseState {
    ERROR,
    DEFAULT,
    SUCCESS,
    WRONG_CREDENTIALS,
    EMAIL_REQUIRES_VERIFICATION,
    VERIFICATION_EMAIL_SENT,
    VERIFICATION_EMAIL_ALREADY_SENT,
    FORGOT_PASSWORD_EMAIL_SENT,
}

const getErrorMessage = (loginResponseState: LoginResponseState) => {
    switch (loginResponseState) {
        case LoginResponseState.ERROR:
            return 'Something went wrong.';
        case LoginResponseState.WRONG_CREDENTIALS:
            return 'Wrong email or password';
        case LoginResponseState.EMAIL_REQUIRES_VERIFICATION:
            return 'Please verify your email';
        case LoginResponseState.VERIFICATION_EMAIL_SENT:
            return 'Verification email sent';
        case LoginResponseState.VERIFICATION_EMAIL_ALREADY_SENT:
            return 'Verification email was recently sent';
        case LoginResponseState.FORGOT_PASSWORD_EMAIL_SENT:
            return 'Forgot password email sent';

        case LoginResponseState.DEFAULT:
        case LoginResponseState.SUCCESS:
            return '';
    }
};

export const LoginModal = () => {
    const { colors } = useTheme();
    const route = useEmbtrRoute(Routes.LOGIN_MODAL);
    const newAccountEmail = route.params?.newAccountEmail;

    const [email, setEmail] = React.useState(newAccountEmail ?? '');
    const [password, setPassword] = React.useState('');
    const [loginResponseState, setLoginResponseState] = React.useState(LoginResponseState.DEFAULT);

    const textPadding = isShortDevice() ? PADDING_SMALL : PADDING_LARGE;
    const formValid = email.length > 0 && password.length > 0;
    const error = getErrorMessage(loginResponseState);

    const useConfetti = useAppSelector(getFireConfetti);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        if (newAccountEmail) {
            useConfetti();
        }
    }, [newAccountEmail]);

    const onLogin = async () => {
        Keyboard.dismiss();
        const auth = getAuth();
        dispatch(setGlobalLoading(true));

        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            if (!userCredentials.user?.emailVerified) {
                dispatch(setGlobalLoading(false));
                setLoginResponseState(LoginResponseState.EMAIL_REQUIRES_VERIFICATION);
                getAuth().signOut();
            } else {
                setLoginResponseState(LoginResponseState.SUCCESS);
            }
        } catch (error: any) {
            dispatch(setGlobalLoading(false));
            handleLoginError(error);
        }
    };

    const handleForgotPassword = async () => {
        const result = await UserController.forgotPassword(email);
        if (result.success) {
            setLoginResponseState(LoginResponseState.FORGOT_PASSWORD_EMAIL_SENT);
        }
    };

    const handleLoginError = (errorCode: string) => {
        switch (errorCode) {
            case 'auth/invalid-email':
            case 'auth/internal-error':
            case 'auth/wrong-password':
                setLoginResponseState(LoginResponseState.WRONG_CREDENTIALS);
                break;
            default:
                setLoginResponseState(LoginResponseState.WRONG_CREDENTIALS);
        }
    };

    const sendVerficationEmail = async () => {
        const result = await UserController.sendVerifyEmail(email);
        setLoginResponseState(LoginResponseState.DEFAULT);

        switch (result.internalCode) {
            case Code.SUCCESS:
                setLoginResponseState(LoginResponseState.VERIFICATION_EMAIL_SENT);
                break;

            case Code.SEND_ACCOUNT_VERIFICATION_EMAIL_TOO_MANY_ATTEMPTS:
                setLoginResponseState(LoginResponseState.VERIFICATION_EMAIL_ALREADY_SENT);
                break;

            default:
                setLoginResponseState(LoginResponseState.ERROR);
                break;
        }
    };

    return (
        <Screen>
            <View style={{ flex: 1 }}>
                <EmbtrKeyboardAvoidingScrollView
                    header={<Banner name={''} leftText="cancel" leftRoute={'BACK'} />}
                >
                    <View style={{ flex: 0.25 }} />
                    <View>
                        <View style={{ alignItems: 'center', paddingTop: PADDING_LARGE * 2 }}>
                            <Image
                                source={require('assets/logo.png')}
                                style={{ width: 150, height: 150 }}
                            />
                        </View>
                        <Text
                            style={{
                                paddingTop: PADDING_LARGE,
                                color: colors.text,
                                textAlign: 'center',
                                fontSize: 24,
                                paddingBottom: PADDING_LARGE,
                                fontFamily: POPPINS_MEDIUM,
                            }}
                        >
                            Login
                        </Text>

                        <Text
                            style={{
                                color: colors.secondary_text,
                                fontFamily: POPPINS_REGULAR,
                                paddingHorizontal: PADDING_LARGE,
                                fontSize: 14,
                                textAlign: 'center',
                            }}
                        >
                            Please enter your email and password to login
                        </Text>

                        <Text
                            style={{
                                textAlign: 'center',
                                fontFamily: POPPINS_REGULAR,
                                color: colors.progress_bar_complete,
                                paddingTop: PADDING_MEDIUM,
                                paddingBottom: PADDING_LARGE,
                            }}
                        >
                            {newAccountEmail &&
                                'Nailed it! 🎉 Please check your email to verify your new account.'}
                        </Text>
                        <View style={{ alignItems: 'center', paddingHorizontal: PADDING_LARGE }}>
                            <View
                                style={{
                                    backgroundColor: colors.card_background,
                                    width: '100%',
                                    borderRadius: 10,
                                    padding: PADDING_LARGE,
                                }}
                            >
                                <View>
                                    <View>
                                        <View>
                                            <TextInput
                                                style={{
                                                    color: colors.text,
                                                    backgroundColor: colors.text_input_background,
                                                    paddingLeft: PADDING_LARGE,
                                                    borderRadius: 5,
                                                    paddingVertical: textPadding,
                                                }}
                                                placeholder={'email'}
                                                placeholderTextColor={colors.secondary_text}
                                                autoCapitalize={'none'}
                                                onChangeText={setEmail}
                                                value={email}
                                            />

                                            <Text
                                                style={{
                                                    color: colors.error,
                                                    fontSize: 12,
                                                    position: 'absolute',
                                                    zIndex: 2,
                                                    right: 2,
                                                    bottom: 1,
                                                }}
                                            >
                                                {error}
                                            </Text>
                                        </View>
                                        <View style={{ height: PADDING_LARGE }} />
                                        <TextInput
                                            style={{
                                                color: colors.text,
                                                backgroundColor: colors.text_input_background,
                                                paddingLeft: PADDING_LARGE,
                                                borderRadius: 5,
                                                paddingVertical: textPadding,
                                            }}
                                            placeholder={'password'}
                                            placeholderTextColor={colors.secondary_text}
                                            autoCapitalize={'none'}
                                            onChangeText={setPassword}
                                            value={password}
                                            secureTextEntry={true}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View style={{ height: PADDING_LARGE * 2 }} />

                            <TouchableOpacity
                                onPress={onLogin}
                                disabled={!formValid}
                                style={{
                                    width: '100%',
                                    backgroundColor: formValid
                                        ? colors.accent_color
                                        : colors.accent_color_dim,
                                    borderRadius: 5,
                                }}
                            >
                                <Text
                                    style={{
                                        color: formValid ? colors.text : colors.secondary_text,
                                        textAlign: 'center',
                                        fontFamily: POPPINS_MEDIUM,
                                        paddingVertical: PADDING_LARGE / 2,
                                    }}
                                >
                                    Let's Go!
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text
                            onPress={() => {
                                if (
                                    loginResponseState ===
                                    LoginResponseState.EMAIL_REQUIRES_VERIFICATION
                                ) {
                                    sendVerficationEmail();
                                } else {
                                    handleForgotPassword();
                                }
                            }}
                            style={{
                                color: email.length > 0 ? colors.link : colors.secondary_text,
                                textAlign: 'center',
                                fontFamily: POPPINS_REGULAR,
                                paddingTop: PADDING_LARGE,
                            }}
                        >
                            {loginResponseState === LoginResponseState.EMAIL_REQUIRES_VERIFICATION
                                ? 'Resend Verification Email'
                                : 'Forgot Password'}
                        </Text>
                        <View style={{ height: PADDING_LARGE }} />
                    </View>
                </EmbtrKeyboardAvoidingScrollView>
            </View>
        </Screen>
    );
};
