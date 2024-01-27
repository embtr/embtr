import { ReactNode } from 'react';
import { ModalBase } from 'src/components/common/modal/ModalBase';
import { Modal, Pressable, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PADDING_LARGE } from 'src/util/constants';

interface Props {
    visible: boolean;
    onDismiss: Function;
    children: ReactNode;
}

export const EmbtrModal = ({ visible, onDismiss, children }: Props) => {
    const colors = useTheme().colors;

    return (
        <ModalBase visible={visible}>
            <Modal visible={visible} transparent={true} animationType={'fade'}>
                <Pressable
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        paddingHorizontal: PADDING_LARGE,
                    }}
                    onPress={(event) => {
                        if (event.target === event.currentTarget) {
                            onDismiss();
                        }
                    }}
                >
                    <View style={{ flex: 1 }} />
                    <View
                        style={{
                            backgroundColor: colors.modal_background,
                            borderRadius: 7,
                            width: '100%',
                        }}
                    >
                        {children}
                    </View>
                    <View style={{ flex: 1 }} />
                </Pressable>
            </Modal>
        </ModalBase>
    );
};
