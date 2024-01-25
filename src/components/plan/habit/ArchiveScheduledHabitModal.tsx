import { Modal, TouchableOpacity, View, Text, Pressable } from 'react-native';
import { getWindowHeight } from 'src/util/GeneralUtility';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ModalBase } from 'src/components/common/modal/ModalBase';
import {
    PADDING_LARGE,
    PADDING_MEDIUM,
    PADDING_SMALL,
    POPPINS_MEDIUM,
    POPPINS_REGULAR,
} from 'src/util/constants';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';

interface Props {
    visible: boolean;
    onArchive: Function;
    onDismiss: Function;
}

export const ArchiveScheduledHabitModal = ({ visible, onArchive, onDismiss }: Props) => {
    const { colors } = useTheme();

    const { title } = useCreateEditScheduleHabit();

    const onHandleDismiss = () => {
        onDismiss();
    };

    const body = (
        <View style={{ alignItems: 'center' }}>
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
                        textAlign: 'center',
                    }}
                >
                    Archive Habit
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

            <View style={{ paddingTop: PADDING_LARGE }}>
                <Text
                    style={{
                        textAlign: 'center',
                        fontSize: 12,
                        fontFamily: POPPINS_REGULAR,
                        paddingLeft: PADDING_MEDIUM,
                        paddingRight: PADDING_MEDIUM,
                        paddingBottom: PADDING_MEDIUM,
                        color: colors.text,
                    }}
                >
                    Once you archive this habit, you will no longer be able to edit it.
                </Text>
            </View>

            <View>
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity
                        style={{
                            backgroundColor: colors.link,
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
                                top: 2,
                                color: colors.text,
                                paddingHorizontal: PADDING_LARGE * 3,
                            }}
                        >
                            Nevermind!
                        </Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
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
                            onArchive();
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                fontSize: 12,
                                fontFamily: POPPINS_REGULAR,
                                color: colors.archive,
                            }}
                        >
                            Archive
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <ModalBase visible={visible}>
            <Modal visible={visible} transparent={true} animationType={'fade'}>
                <Pressable
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                    }}
                    onPress={(event) => {
                        if (event.target === event.currentTarget) {
                            onHandleDismiss();
                        }
                    }}
                >
                    <View style={{ flex: 1 }} />
                    <View
                        style={{
                            backgroundColor: colors.modal_background,
                            borderRadius: 7,
                            width: '80%',
                            paddingTop: PADDING_LARGE,
                            paddingBottom: PADDING_SMALL / 2,
                        }}
                    >
                        {body}
                    </View>
                    <View style={{ flex: 1 }} />
                </Pressable>
            </Modal>
        </ModalBase>
    );
};
