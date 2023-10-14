import { Modal, TouchableOpacity, View, Text, Pressable } from 'react-native';
import { getWindowHeight } from 'src/util/GeneralUtility';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ModalBase } from 'src/components/common/modal/ModalBase';
import {
    CARD_SHADOW,
    POPPINS_MEDIUM,
    POPPINS_REGULAR,
    POPPINS_SEMI_BOLD,
    TIMELINE_CARD_PADDING,
} from 'src/util/constants';
import { PlannedHabitCustomHooks } from 'src/controller/habit/PlannedHabitController';
import { HabitCustomHooks } from 'src/controller/habit/HabitController';
import { PlannedHabitService } from 'src/service/PlannedHabitService';
import { SvgUri } from 'react-native-svg';

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

    const svgUri = plannedHabit.data?.iconUrl ?? scheduledHabit.data?.task?.iconUrl ?? '';

    const body = (
        <View style={{ flex: 1, alignItems: 'center' }}>
            {/* top section */}
            <View
                style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <View
                    style={{
                        width: '100%',
                        flexDirection: 'row',
                        paddingTop: TIMELINE_CARD_PADDING,
                        paddingLeft: TIMELINE_CARD_PADDING,
                    }}
                >
                    <View style={{ height: 25, width: 25 }}>
                        <SvgUri width={25} height={25} uri={svgUri} />
                    </View>
                    <View style={{ width: TIMELINE_CARD_PADDING / 2 }} />
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontSize: 20,
                                width: '100%',
                                fontFamily: POPPINS_MEDIUM,
                                color: colors.accent_color,
                            }}
                        >
                            {habitTitle}
                        </Text>
                    </View>
                </View>
            </View>

            {/* middle section */}
            <View
                style={{
                    width: '100%',
                    flex: 1,
                    paddingTop: TIMELINE_CARD_PADDING,
                }}
            >
                <Text
                    style={{
                        fontSize: 12,
                        fontFamily: 'Poppins_400Regular',
                        paddingHorizontal: TIMELINE_CARD_PADDING,
                        color: colors.text,
                    }}
                >
                    <Text style={{ fontFamily: POPPINS_SEMI_BOLD }}>Remove this habit </Text>
                    from today or from your habit schedule. You can always add it back later.
                </Text>
            </View>

            {/* bottom section */}
            <View
                style={{
                    flex: 1,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingHorizontal: TIMELINE_CARD_PADDING,
                }}
            >
                <TouchableOpacity
                    style={[
                        {
                            width: '100%',
                            backgroundColor: colors.toggle_color,
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
                            paddingVertical: 3,
                        }}
                    >
                        Nevermind!
                    </Text>
                </TouchableOpacity>

                <View style={{ height: TIMELINE_CARD_PADDING }} />

                <TouchableOpacity
                    style={[
                        {
                            width: '100%',
                            backgroundColor: colors.accent_color,
                            paddingVertical: 5,
                            borderRadius: 6,
                        },
                        CARD_SHADOW,
                    ]}
                    onPress={async () => {
                        if (plannedHabit.data) {
                            await PlannedHabitService.deactivate({
                                ...plannedHabit.data,
                            });
                        }
                        onHandleDismiss();
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 14,
                            fontFamily: POPPINS_REGULAR,
                            color: colors.text,
                            paddingVertical: 3,
                        }}
                    >
                        Remove For Today
                    </Text>
                </TouchableOpacity>

                <View style={{ height: TIMELINE_CARD_PADDING }} />

                <TouchableOpacity
                    style={{
                        width: '100%',
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

                <View style={{ height: TIMELINE_CARD_PADDING }} />
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
                            width: getWindowHeight() / 3,
                            height: getWindowHeight() / 3.5,
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
