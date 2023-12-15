import { Modal, Pressable, Keyboard, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { getWindowHeight } from 'src/util/GeneralUtility';

interface Props {
    visible: boolean;
    onDismiss: Function;
    children: any;
}
export const SettingsDeleteAccountConfirmModal = ({ visible, onDismiss, children}: Props) => {
    const colors = useTheme().colors;
    const top = getWindowHeight() / 2 - 150;

    return (
        <Modal visible={visible} transparent={true} animationType={'slide'}>
            <Pressable
                onPress={() => {
                    onDismiss();
                }}
                style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: 'rgba(000,000,000,.6)',
                }}
            >
                <Pressable
                    onPress={() => {
                        // setKeyboardFocused(false);
                        Keyboard.dismiss();
                    }}
                    style={{
                        position: 'absolute',
                        zIndex: 1,
                        flexDirection: 'row',
                        top: top,
                        alignSelf: 'center',
                    }}
                >
                    <View
                        style={{
                            width: 350,
                            backgroundColor: colors.modal_background,
                            borderRadius: 12,
                        }}
                    >
                        {children}
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};
