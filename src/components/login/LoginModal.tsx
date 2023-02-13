import * as React from 'react';
import { View, TouchableOpacity, Modal, Button, Text, Keyboard } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TextInput } from 'react-native-gesture-handler';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getWindowHeight } from 'src/util/GeneralUtility';
import { isIosApp } from 'src/util/DeviceUtil';
import { POPPINS_REGULAR } from 'src/util/constants';

interface Props {
    visible: boolean;
    confirm: Function;
    dismiss: Function;
    onAuthenticated: Function;
}

export const LoginModal = ({ visible, confirm, dismiss, onAuthenticated }: Props) => {
    const { colors } = useTheme();

    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [emailVerified, setEmailVerified] = React.useState<boolean>(true);

    const [keyboardOpen, setKeyboardOpen] = React.useState(false);

    const onDismissModal = () => {
        if (keyboardOpen) {
            Keyboard.dismiss();
        } else {
            dismiss();
        }
    };

    React.useEffect(() => {
        Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
        Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));

        return () => {
            Keyboard.removeAllListeners('keyboardDidShow');
            Keyboard.removeAllListeners('keyboardDidHide');
        };
    }, []);

    return (
        <Modal visible={visible} transparent={true} animationType={'slide'}>
            <TouchableOpacity
                style={{ height: getWindowHeight() / 3.5, width: '100%' }}
                onPress={() => {
                    onDismissModal();
                }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity
                    style={{ flex: 1, width: '100%' }}
                    onPress={() => {
                        onDismissModal();
                    }}
                />

                <View
                    style={{
                        width: 300,
                        height: getWindowHeight() / 4,
                        backgroundColor: colors.modal_background,
                        borderRadius: 7,
                    }}
                >
                    <View style={{ alignItems: 'center', flex: 1, width: '100%' }}>
                        <View style={{ flex: 1, width: '100%' }}>
                            <Text style={{ fontSize: 14, fontFamily: 'Poppins_500Medium', color: colors.text, paddingTop: 15, textAlign: 'center' }}>
                                Embtr Login
                            </Text>
                        </View>
                        {emailVerified ? (
                            <View style={{ width: '100%', flex: 2 }}>
                                <View style={{ width: '100%', alignItems: 'center', paddingTop: 10, paddingBottom: 10, paddingLeft: 2, paddingRight: 2 }}>
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
                                        placeholder={'email'}
                                        placeholderTextColor={colors.secondary_text}
                                        onChangeText={setEmail}
                                        value={email}
                                    />
                                </View>
                                <View style={{ width: '100%', alignItems: 'center', paddingBottom: 10, paddingLeft: 2, paddingRight: 2 }}>
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
                            </View>
                        ) : (
                            <View style={{ flex: 2, justifyContent: 'center' }}>
                                <Text style={{ color: colors.text, fontFamily: POPPINS_REGULAR }}>please verify your email.</Text>
                            </View>
                        )}

                        <View style={{ flex: 1, width: '100%' }}>
                            {emailVerified ? (
                                <View style={{ width: '100%', flex: 1, justifyContent: 'flex-end' }}>
                                    <HorizontalLine />
                                    <Button
                                        title="Login"
                                        onPress={() => {
                                            const auth = getAuth();
                                            signInWithEmailAndPassword(auth, email, password)
                                                .then((userCredential) => {
                                                    setEmailVerified(userCredential.user.emailVerified);
                                                })
                                                .catch((error) => {
                                                    const errorCode = error.code;
                                                    const errorMessage = error.message;
                                                });

                                            dismiss();
                                        }}
                                    />
                                </View>
                            ) : (
                                <View style={{ width: '100%', flex: 1, justifyContent: 'flex-end' }}>
                                    <HorizontalLine />
                                    <Button title="Resend Email" onPress={() => {}} />
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={{ flex: 1, width: '100%' }}
                    onPress={() => {
                        onDismissModal();
                    }}
                />
            </View>
            <TouchableOpacity
                style={{ flex: 1, width: '100%' }}
                onPress={() => {
                    onDismissModal();
                }}
            />
        </Modal>
    );
};
