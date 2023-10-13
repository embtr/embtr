import { Modal, TouchableOpacity, View, Text, Pressable } from 'react-native';
import { getWindowHeight } from 'src/util/GeneralUtility';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ModalBase } from 'src/components/common/modal/ModalBase';
import {
    CARD_SHADOW,
    POPPINS_MEDIUM,
    POPPINS_REGULAR,
    TIMELINE_CARD_PADDING,
} from 'src/util/constants';
import { PlannedHabitCustomHooks } from 'src/controller/habit/PlannedHabitController';
import { HabitCustomHooks } from 'src/controller/habit/HabitController';

interface Props {
    visible: boolean;
    onDismiss: Function;
    habitTitle: string;
    plannedHabitId?: number;
    scheduledHabitId: number;
}

export const RemoveHabitModal = ({
    visible,
    onDismiss,
    habitTitle,
    plannedHabitId,
    scheduledHabitId,
}: Props) => {
    const { colors } = useTheme();

    const onHandleDismiss = () => {
        onDismiss();
    };

    const plannedHabit = PlannedHabitCustomHooks.usePlannedHabit(plannedHabitId ?? 0);
    const scheduledHabit = HabitCustomHooks.useScheduledHabit(scheduledHabitId);

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
                        Remove Habit
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
                        {habitTitle}
                    </Text>
                </View>

                <View style={{ paddingTop: TIMELINE_CARD_PADDING }}>
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

                <View
                    style={{
                        flex: 1,
                        paddingVertical: TIMELINE_CARD_PADDING,
                    }}
                >
                    <View
                        style={{
                            flex: 1.5,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <TouchableOpacity
                            style={[
                                {
                                    backgroundColor: colors.toggle_color,
                                    width: '90%',
                                    paddingVertical: 5,
                                    borderRadius: 6,
                                },
                                CARD_SHADOW,
                            ]}
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
                    <View style={{ height: 7.5 }} />
                    <View
                        style={{
                            flex: 1.5,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <TouchableOpacity
                            style={[
                                {
                                    backgroundColor: colors.accent_color,
                                    width: '90%',
                                    paddingVertical: 5,
                                    borderRadius: 6,
                                },
                                CARD_SHADOW,
                            ]}
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
                                Remove For Today
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View
                        style={{
                            flex: 1.5,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                width: '90%',
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
                                    color: colors.archive,
                                }}
                            >
                                Archive
                            </Text>
                        </TouchableOpacity>
                    </View>
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
