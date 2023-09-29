import React from 'react';
import { RegisterSuccessModal } from './RegisterSuccessModalBody';
import { RegisterModalBody } from './RegisterModalBody';
import { getWindowHeight, wait } from 'src/util/GeneralUtility';
import { Keyboard, Modal, TouchableOpacity, View } from 'react-native';
import { setGlobalBlurBackground } from 'src/redux/user/GlobalState';
import { useDispatch } from 'react-redux';

interface Props {
    visible: boolean;
    onDismiss: Function;
}

export const RegisterModal = ({ visible, onDismiss }: Props) => {
    const [displayRegisterModal, setDisplayRegisterModal] = React.useState(true);
    const [keyboardOpen, setKeyboardOpen] = React.useState(false);

    const dispatch = useDispatch();

    const onRegisterSuccessModalDismiss = () => {
        onDismiss();
        wait(750).then(() => {
            setDisplayRegisterModal(true);
        });
    };

    const onRegisterModalConfirm = (registrationSuccess: boolean) => {
        setDisplayRegisterModal(false);
    };

    React.useEffect(() => {
        dispatch(setGlobalBlurBackground(visible));

        return () => {
            dispatch(setGlobalBlurBackground(false));
        };
    }, [visible]);

    React.useEffect(() => {
        Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
        Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));

        return () => {
            Keyboard.removeAllListeners('keyboardDidShow');
            Keyboard.removeAllListeners('keyboardDidHide');
        };
    }, []);

    const onHandleDismiss = () => {
        if (keyboardOpen) {
            Keyboard.dismiss();
        } else {
            onDismiss();
            setDisplayRegisterModal(true);
        }
    };

    return (
        <Modal visible={visible} transparent={true} animationType={'slide'}>
            <TouchableOpacity
                style={{ height: getWindowHeight() / 4, width: '100%' }}
                onPress={() => {
                    onHandleDismiss();
                }}
            />
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => {
                        onHandleDismiss();
                    }}
                />

                {displayRegisterModal ? (
                    <RegisterModalBody confirm={onRegisterModalConfirm} />
                ) : (
                    <RegisterSuccessModal dismiss={onRegisterSuccessModalDismiss} />
                )}

                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => {
                        onHandleDismiss();
                    }}
                />
            </View>

            <TouchableOpacity
                style={{ flex: 1, width: '100%' }}
                onPress={() => {
                    onHandleDismiss();
                }}
            />
        </Modal>
    );
};
