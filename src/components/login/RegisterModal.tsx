import * as React from 'react';
import { View, TouchableOpacity, Modal, Button, Text, Keyboard } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TextInput } from 'react-native-gesture-handler';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getWindowHeight } from 'src/util/GeneralUtility';
import { isIosApp } from 'src/util/DeviceUtil';

interface Props {
    visible: boolean;
    confirm: Function;
    dismiss: Function;
}

export const RegisterModal = ({ visible, confirm, dismiss }: Props) => {
    const { colors } = useTheme();

    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [passwordConfirmation, setPasswordConfirmation] = React.useState<string>('');

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
                style={{ height: getWindowHeight() / 4, width: '100%' }}
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

                <View style={{ width: 300, backgroundColor: colors.modal_background, borderRadius: 7, justifyContent: 'space-around' }}>
                    <View style={{ alignItems: 'center', width: '100%', paddingTop: 15, paddingBottom: 10 }}>
                        <View>
                            <Text style={{ fontSize: 14, fontFamily: 'Poppins_500Medium', color: colors.text }}>Embtr Login</Text>
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
                                placeholder={'repeat password'}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setPassword}
                                value={password}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <HorizontalLine />
                    <Button
                        title="Sign Up"
                        onPress={() => {
                            const auth = getAuth();
                            createUserWithEmailAndPassword(auth, email, password)
                                .then((userCredential) => {
                                    // Signed in
                                    const user = userCredential.user;
                                    // ...
                                })
                                .catch((error) => {
                                    const errorCode = error.code;
                                    const errorMessage = error.message;
                                    // ..
                                });
                        }}
                    />
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
