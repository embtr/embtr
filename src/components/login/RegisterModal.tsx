import React from 'react';

import { Image, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_MEDIUM, POPPINS_REGULAR, PADDING_LARGE, PADDING_SMALL } from 'src/util/constants';
import { EmbtrKeyboardAvoidingScrollView } from 'src/components/common/scrollview/EmbtrKeyboardAvoidingScrollView';
import { Banner } from 'src/components/common/Banner';
import { isShortDevice } from 'src/util/DeviceUtil';
import { Screen } from 'src/components/common/Screen';
import { Response } from 'resources/types/requests/RequestTypes';
import UserController from 'src/controller/user/UserController';
import { Code } from 'resources/codes';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';
import { useAppDispatch } from 'src/redux/Hooks';
import { setGlobalLoading } from 'src/redux/user/GlobalState';

const enum EmailFormState {
    DEFAULT,
    INVALID_EMAIL,
    EMAIL_IN_USE,
}

const enum PasswordFormState {
    DEFAULT,
    INVALID_PASSWORD,
}

const enum PasswordAgainFormState {
    DEFAULT,
    PASSWORDS_DO_NOT_MATCH,
}

const getEmailFormStateMessage = (state: EmailFormState) => {
    switch (state) {
        case EmailFormState.DEFAULT:
            return '';

        case EmailFormState.INVALID_EMAIL:
            return 'Invalid email';

        case EmailFormState.EMAIL_IN_USE:
            return 'Email in use';
    }
};

const getPasswordFormStateMessage = (state: PasswordFormState) => {
    switch (state) {
        case PasswordFormState.DEFAULT:
            return '';

        case PasswordFormState.INVALID_PASSWORD:
            return 'Invalid password';
    }
};

const getPasswordAgainFormStateMessage = (state: PasswordAgainFormState) => {
    switch (state) {
        case PasswordAgainFormState.DEFAULT:
            return '';

        case PasswordAgainFormState.PASSWORDS_DO_NOT_MATCH:
            return 'Passwords do not match';
    }
};

export const RegisterModal = () => {
    const { colors } = useTheme();

    const navigation = useEmbtrNavigation();
    const dispatch = useAppDispatch();

    const onSuccessComplete = () => {
        navigation.goBack();
        setTimeout(() => {
            navigation.navigate(Routes.LOGIN_MODAL, { newAccountEmail: email });
        }, 250);
    };

    const [emailFormState, setEmailFormState] = React.useState<EmailFormState>(
        EmailFormState.DEFAULT
    );
    const [passwordFormState, setPasswordFormState] = React.useState<PasswordFormState>(
        PasswordFormState.DEFAULT
    );

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordAgain, setPasswordAgain] = React.useState('');

    const textPadding = isShortDevice() ? PADDING_SMALL : PADDING_LARGE;
    const formValid = email.length > 0 && password.length > 0 && password === passwordAgain;

    const clearFormState = () => {
        setEmailFormState(EmailFormState.DEFAULT);
        setPasswordFormState(PasswordFormState.DEFAULT);
    };

    const handleSignUp = async () => {
        dispatch(setGlobalLoading(true));
        clearFormState();
        const result: Response = await UserController.createAccount(email, password);
        switch (result.internalCode) {
            case Code.SUCCESS:
                onSuccessComplete();
                break;

            case Code.CREATE_ACCOUNT_EMAIL_IN_USE:
                setEmailFormState(EmailFormState.EMAIL_IN_USE);
                break;

            case Code.CREATE_ACCOUNT_INVALID_EMAIL:
                setEmailFormState(EmailFormState.INVALID_EMAIL);
                break;

            case Code.CREATE_ACCOUNT_INVALID_PASSWORD:
                setPasswordFormState(PasswordFormState.INVALID_PASSWORD);
                break;
        }
        dispatch(setGlobalLoading(false));
    };

    const passwordAgainFormState =
        password === passwordAgain
            ? PasswordAgainFormState.DEFAULT
            : PasswordAgainFormState.PASSWORDS_DO_NOT_MATCH;

    const emailFormStateMessage = getEmailFormStateMessage(emailFormState);
    const passwordFormStateMessage = getPasswordFormStateMessage(passwordFormState);
    const passwordAgainFormStateMessage = getPasswordAgainFormStateMessage(passwordAgainFormState);

    return (
        <Screen>
            <View style={{ flex: 1 }}>
                <EmbtrKeyboardAvoidingScrollView
                    header={<Banner name={''} leftText="close" leftRoute={'BACK'} />}
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
                            Sign Up
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
                            Sign up below. We look forward to smashing goals with you!
                        </Text>

                        <View style={{ height: PADDING_LARGE * 2 }} />

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
                                                    right: 4,
                                                    bottom: 1,
                                                }}
                                            >
                                                {emailFormStateMessage}
                                            </Text>
                                        </View>
                                        <View style={{ height: PADDING_SMALL }} />
                                        <View>
                                            <Text
                                                style={{
                                                    color: colors.error,
                                                    fontSize: 12,
                                                    position: 'absolute',
                                                    zIndex: 2,
                                                    right: 4,
                                                    bottom: 1,
                                                }}
                                            >
                                                {passwordFormStateMessage}
                                            </Text>

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
                                                onChangeText={setPassword}
                                                value={password}
                                                secureTextEntry={true}
                                            />
                                        </View>

                                        <View style={{ height: PADDING_SMALL }} />
                                        <View>
                                            <Text
                                                style={{
                                                    color: colors.error,
                                                    fontSize: 12,
                                                    position: 'absolute',
                                                    zIndex: 2,
                                                    right: 4,
                                                    bottom: 1,
                                                }}
                                            >
                                                {passwordAgainFormStateMessage}
                                            </Text>

                                            <TextInput
                                                style={{
                                                    color: colors.text,
                                                    backgroundColor: colors.text_input_background,
                                                    paddingLeft: PADDING_LARGE,
                                                    borderRadius: 5,
                                                    paddingVertical: textPadding,
                                                }}
                                                placeholder={'password again'}
                                                placeholderTextColor={colors.secondary_text}
                                                onChangeText={setPasswordAgain}
                                                value={passwordAgain}
                                                secureTextEntry={true}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={{ height: PADDING_LARGE * 2 }} />

                            <TouchableOpacity
                                onPress={async () => {
                                    Keyboard.dismiss();
                                    await handleSignUp();
                                }}
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
                                    {"Let's Go!"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </EmbtrKeyboardAvoidingScrollView>
            </View>
        </Screen>
    );
};
