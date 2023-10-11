import { Modal, TouchableOpacity, View, Text, Pressable } from 'react-native';
import { getWindowHeight } from 'src/util/GeneralUtility';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ModalBase } from 'src/components/common/modal/ModalBase';
import { POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';

interface Props {
    visible: boolean;
    onDismiss: Function;
}

export const ArchiveScheduledHabitModal = ({ visible, onDismiss }: Props) => {
    const { colors } = useTheme();

    const { title } = useCreateEditScheduleHabit();

    const onHandleDismiss = () => {
        onDismiss();
    };

    const body = (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            fontFamily: POPPINS_MEDIUM,
                            color: colors.text,
                            paddingTop: 15,
                            textAlign: 'center',
                        }}
                    >
                        Archive Habit?
                    </Text>

                    <Text
                        style={{
                            fontSize: 16,
                            fontFamily: POPPINS_MEDIUM,
                            color: colors.accent_color,
                            paddingTop: 15,
                            textAlign: 'center',
                        }}
                    >
                        {title}
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
                        Once you archive this habit, you will no longer be able to edit it.
                    </Text>
                </View>

                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }} />
                    <View
                        style={{
                            flex: 1.5,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                backgroundColor: colors.link,
                                width: '90%',
                                paddingVertical: 5,
                                borderRadius: 6,
                            }}
                            onPress={() => {
                                onHandleDismiss();
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 14,
                                    fontFamily: POPPINS_REGULAR,
                                    color: colors.text,
                                }}
                            >
                                Nevermind!
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                marginTop: 2.5,
                                width: '90%',
                                paddingVertical: 5,
                                borderRadius: 6,
                            }}
                            onPress={() => {
                                onHandleDismiss();
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 13,
                                    fontFamily: POPPINS_REGULAR,
                                    color: colors.archive,
                                }}
                            >
                                Archive
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 0.5 }} />
                </View>
            </View>
        </View>
    );

    return (
        <ModalBase visible={visible}>
            <Modal visible={visible} transparent={true} animationType={'fade'}>
                <Pressable
                    style={{
                        backgroundColor: 'transparent',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingBottom: '25%',
                    }}
                    onPress={(event) => {
                        if (event.target === event.currentTarget) {
                            onHandleDismiss();
                        }
                    }}
                >
                    <View
                        style={{
                            width: 300,
                            height: getWindowHeight() / 3,
                            backgroundColor: colors.modal_background,
                            borderRadius: 7,
                            justifyContent: 'space-around',
                        }}
                    >
                        {body}
                    </View>
                </Pressable>
            </Modal>
        </ModalBase>
    );
};
