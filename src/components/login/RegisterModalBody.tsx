import * as React from 'react';
import { View, Button, Text, ActivityIndicator } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TextInput } from 'react-native-gesture-handler';
import { isIosApp } from 'src/util/DeviceUtil';
import { Response } from 'resources/types/requests/RequestTypes';
import UserController from 'src/controller/user/UserController';
import { Code } from '../../../resources/codes';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { getWindowHeight } from 'src/util/GeneralUtility';

interface Props {
    confirm: Function;
}

export const RegisterModalBody = ({ confirm }: Props) => {
    const { colors } = useTheme();

    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [passwordConfirmation, setPasswordConfirmation] = React.useState<string>('');
    const [error, setError] = React.useState<string>('');
    const [isCreatingAccount, setIsCreatingAccount] = React.useState<boolean>(false);

    return (
        <View
            style={{
                width: 300,
                height: getWindowHeight() / 3 + 25,
                backgroundColor: colors.modal_background,
                borderRadius: 7,
                justifyContent: 'space-around',
            }}
        >
            <View style={{ flex: 1, alignItems: 'center', paddingTop: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }} />
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 14,
                            flex: 3,
                            fontFamily: 'Poppins_500Medium',
                            color: colors.text,
                        }}
                    >
                        Sign Up For Embtr
                    </Text>
                    <ActivityIndicator
                        animating={isCreatingAccount}
                        size="small"
                        color={colors.secondary_text}
                        style={{ flex: 1 }}
                    />
                </View>
                <View style={{ paddingTop: 10 }}>
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 12,
                            fontFamily: 'Poppins_400Regular',
                            paddingLeft: 10,
                            paddingRight: 10,
                            color: colors.text,
                        }}
                    >
                        Ready to chase your dreams?
                    </Text>
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 12,
                            fontFamily: 'Poppins_400Regular',
                            paddingLeft: 10,
                            paddingRight: 10,
                            color: colors.text,
                        }}
                    >
                        Sign up below.
                    </Text>
                </View>
            </View>

            <View style={{ width: '100%', flex: 2 }}>
                <View
                    style={{
                        width: '100%',
                        alignItems: 'center',
                        paddingTop: 10,
                        paddingBottom: error ? 0 : 10,
                        paddingLeft: 2,
                        paddingRight: 2,
                    }}
                >
                    <TextInput
                        autoCapitalize="none"
                        textAlignVertical="top"
                        style={{
                            width: '95%',
                            fontFamily: 'Poppins_400Regular',
                            borderRadius: 7,
                            backgroundColor: colors.text_input_background,
                            borderColor: colors.text_input_border,
                            borderWidth: 1,
                            color: colors.text,
                            paddingTop: 10,
                            paddingBottom: isIosApp() ? 8 : 0,
                            paddingLeft: 10,
                            paddingRight: 10,
                        }}
                        placeholder={'email'}
                        placeholderTextColor={colors.secondary_text}
                        onChangeText={setEmail}
                        value={email}
                    />
                </View>

                {error && (
                    <View style={{ width: '100%', flexDirection: 'row', paddingTop: 5 }}>
                        <Text
                            style={{
                                flex: 1,
                                paddingLeft: 20,
                                color: colors.error,
                                fontSize: 12,
                                fontFamily: POPPINS_SEMI_BOLD,
                            }}
                        >
                            {error}
                        </Text>
                        {error.includes('in use') && (
                            <Text
                                style={{
                                    flex: 1,
                                    paddingLeft: 20,
                                    color: colors.link,
                                    fontSize: 12,
                                    fontFamily: POPPINS_SEMI_BOLD,
                                }}
                            >
                                reset password
                            </Text>
                        )}
                    </View>
                )}

                <View
                    style={{
                        width: '100%',
                        alignItems: 'center',
                        paddingBottom: 10,
                        paddingLeft: 2,
                        paddingRight: 2,
                        paddingTop: error ? 5 : 0,
                    }}
                >
                    <TextInput
                        textAlignVertical="top"
                        style={{
                            width: '95%',
                            fontFamily: 'Poppins_400Regular',
                            borderRadius: 7,
                            backgroundColor: colors.text_input_background,
                            borderColor: colors.text_input_border,
                            borderWidth: 1,
                            color: colors.text,
                            paddingTop: 10,
                            paddingBottom: isIosApp() ? 8 : 0,
                            paddingLeft: 10,
                            paddingRight: 10,
                        }}
                        placeholder={'password'}
                        placeholderTextColor={colors.secondary_text}
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry
                    />
                </View>
                <View
                    style={{
                        width: '100%',
                        alignItems: 'center',
                        paddingBottom: 10,
                        paddingLeft: 2,
                        paddingRight: 2,
                    }}
                >
                    <TextInput
                        textAlignVertical="top"
                        style={{
                            width: '95%',
                            fontFamily: 'Poppins_400Regular',
                            borderRadius: 7,
                            backgroundColor: colors.text_input_background,
                            borderColor: colors.text_input_border,
                            borderWidth: 1,
                            color: colors.text,
                            paddingTop: 10,
                            paddingBottom: isIosApp() ? 8 : 0,
                            paddingLeft: 10,
                            paddingRight: 10,
                        }}
                        placeholder={'repeat password'}
                        placeholderTextColor={colors.secondary_text}
                        onChangeText={setPasswordConfirmation}
                        value={passwordConfirmation}
                        secureTextEntry
                    />
                </View>
            </View>

            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <HorizontalLine />
                <Button
                    disabled={isCreatingAccount}
                    title="Sign Up"
                    onPress={() => {
                        const handleSignUp = async () => {
                            setIsCreatingAccount(true);
                            const result: Response = await UserController.createAccount(
                                email,
                                password
                            );
                            switch (result.internalCode) {
                                case Code.SUCCESS:
                                    setError('');
                                    confirm();
                                    break;

                                case Code.CREATE_ACCOUNT_EMAIL_IN_USE:
                                    setError('email already in use');
                                    break;

                                case Code.CREATE_ACCOUNT_INVALID_EMAIL:
                                    setError('email address is invalid');
                                    break;

                                case Code.CREATE_ACCOUNT_INVALID_PASSWORD:
                                    setError('password is invalid');
                            }

                            setIsCreatingAccount(false);
                        };

                        handleSignUp();
                    }}
                />
            </View>
        </View>
    );
};
