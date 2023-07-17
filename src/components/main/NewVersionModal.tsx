import { getWindowHeight } from 'src/util/GeneralUtility';
import { Modal, TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { UpdateUtility } from 'src/util/updates/UpdateUtility';
import { ModalBase } from '../common/modal/ModalBase';

interface Props {
    visible: boolean;
    onDismiss: Function;
}

export const NewVersionModal = ({ visible, onDismiss }: Props) => {
    const { colors } = useTheme();

    const onHandleDismiss = () => {
        onDismiss();
    };
    return (
        <ModalBase visible={visible}>
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

                    <View
                        style={{
                            width: 300,
                            height: getWindowHeight() / 3,
                            backgroundColor: colors.modal_background,
                            borderRadius: 7,
                            justifyContent: 'space-around',
                        }}
                    >
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <View style={{ flex: 1 }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        width: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontFamily: 'Poppins_500Medium',
                                            color: colors.text,
                                            paddingTop: 15,
                                            textAlign: 'center',
                                        }}
                                    >
                                        New Version Available!
                                    </Text>
                                </View>

                                <View style={{ paddingTop: 25 }}>
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
                                        Embtr has improved! To get the latest version, please update
                                        your app.
                                    </Text>
                                </View>
                            </View>

                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text
                                        onPress={() => {
                                            UpdateUtility.navigateToAppStore();
                                        }}
                                        style={{
                                            textAlign: 'center',
                                            fontSize: 12,
                                            fontFamily: 'Poppins_400Regular',
                                            paddingLeft: 10,
                                            paddingRight: 10,
                                            color: colors.tab_selected,
                                        }}
                                    >
                                        Visit the App Store
                                    </Text>
                                </View>

                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text
                                        onPress={() => {
                                            onDismiss();
                                        }}
                                        style={{
                                            textAlign: 'center',
                                            flex: 1,
                                            fontSize: 12,
                                            fontFamily: 'Poppins_400Regular',
                                            paddingLeft: 10,
                                            paddingRight: 10,
                                            color: colors.tab_selected,
                                        }}
                                    >
                                        maybe later!
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
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
        </ModalBase>
    );
};
