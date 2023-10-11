import React from 'react';
import { Modal, TouchableOpacity, View, PanResponder } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ModalBase } from 'src/components/common/modal/ModalBase';

interface Props {
    children: any;
    visible: boolean;
    onDismiss: Function;
}

export const SlideUpModal = ({ children, visible, onDismiss }: Props) => {
    const { colors } = useTheme();

    const onHandleDismiss = () => {
        onDismiss();
    };

    const panResponder = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => false,
            onPanResponderMove: (_, gestureState) => {
                // Close the modal if the user swipes down beyond a certain threshold
                if (gestureState.dy > 50) {
                    onHandleDismiss();
                }
            },
            onPanResponderRelease: () => {},
            onPanResponderTerminate: () => {},
        })
    ).current;

    return (
        <ModalBase visible={visible}>
            <Modal visible={visible} transparent={true} animationType={'slide'}>
                <TouchableOpacity
                    style={{ flex: 1.5, width: '100%' }}
                    onPress={() => {
                        onHandleDismiss();
                    }}
                />
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: colors.modal_background,
                            borderTopRightRadius: 15,
                            borderTopLeftRadius: 15,
                            justifyContent: 'space-around',
                        }}
                        {...panResponder.panHandlers}
                    >
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                            }}
                        >
                            <View
                                style={{
                                    marginTop: 5,
                                    paddingTop: 5,
                                    width: '15%',
                                    height: 3,
                                    backgroundColor: colors.secondary_text,
                                    borderRadius: 5,
                                }}
                            />
                            {children}
                        </View>
                    </View>
                </View>
            </Modal>
        </ModalBase>
    );
};
