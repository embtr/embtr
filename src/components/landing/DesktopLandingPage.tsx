import * as React from 'react';
import { Text, TextStyle, Image, View, TouchableOpacity } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_REGULAR } from 'src/util/constants';
import { LoginModal } from '../login/LoginModal';
import { ModalContainingComponent } from '../common/modal/ModalContainingComponent';
import { RegisterModal } from '../login/RegisterModal';

interface Props {
    continueToLogin: Function;
}
export const DesktopLandingPage = ({ continueToLogin }: Props) => {
    const { colors } = useTheme();

    const textStyle = {
        fontSize: 14,
        color: colors.text,
        textAlign: 'center',
        fontFamily: 'Poppins_400Regular',
    } as TextStyle;

    const [displayLoginModal, setDisplayLoginModal] = React.useState(false);
    const [displayRegisterModal, setDisplayRegisterModal] = React.useState(false);

    const onLoginModalCancel = () => {
        setDisplayLoginModal(false);
    };

    const onLoginModalConfirm = () => {
        setDisplayLoginModal(false);
    };

    return (
        <Screen>
            <ModalContainingComponent modalVisible={displayLoginModal || displayRegisterModal} />
            <LoginModal
                visible={displayLoginModal}
                confirm={onLoginModalConfirm}
                dismiss={onLoginModalCancel}
            />
            <RegisterModal
                visible={displayRegisterModal}
                onDismiss={() => {
                    setDisplayRegisterModal(false);
                }}
            />

            <View style={{ width: '100%', flex: 1, justifyContent: 'flex-end' }}>
                {/* FLEX 1 LOGO */}
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <View style={{ bottom: '10%' }}>
                        <Image
                            source={require('assets/logo.png')}
                            style={{ width: 200, height: 200 }}
                        />
                    </View>
                    <Image
                        source={require('assets/logo_text.png')}
                        style={{ width: 150, height: 50 }}
                    />
                </View>

                {/* FLEX 3 BUTTONS*/}
                <View style={{ flex: 1 }}>
                    {/* FLEX 2 TEXY*/}
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={textStyle}>
                                A community achieving their wildest dreams.
                            </Text>
                            <Text style={textStyle}>Together.</Text>
                        </View>

                        <View
                            style={{
                                flex: 2,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.text,
                                    textAlign: 'center',
                                    fontFamily: POPPINS_REGULAR,
                                    paddingTop: 20,
                                }}
                            >
                                Desktop browsers are not currently supported. Mobile browsers are!{' '}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    continueToLogin();
                                }}
                            >
                                <Text
                                    style={{
                                        color: colors.link,
                                        textAlign: 'center',
                                        fontFamily: POPPINS_REGULAR,
                                        paddingTop: 20,
                                    }}
                                >
                                    continue anyway.
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Screen>
    );
};
