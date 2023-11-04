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
import { SvgUri } from 'react-native-svg';
import { PlannedDay, PlannedTask } from 'resources/schema';
import { getDatePrettyFullMonth } from 'src/util/DateUtility';
import { NewPlannedHabitData } from 'src/model/PlannedHabitModels';

interface Props {
    visible: boolean;
    editPlannedHabit: (id: number) => void;
    editNewPlannedHabit: (newPlannedHabit: NewPlannedHabitData) => void;
    editScheduledHabit: (id: number) => void;
    dismiss: () => void;
    plannedHabit: PlannedTask;
    plannedDay: PlannedDay;
}

export const EditHabitModal = ({
    visible,
    editPlannedHabit,
    editNewPlannedHabit,
    editScheduledHabit,
    dismiss,
    plannedHabit,
    plannedDay,
}: Props) => {
    const { colors } = useTheme();

    const svgUri = plannedHabit.iconUrl ?? '';

    const isLargerScreen = getWindowHeight() > 800;
    const buttonPadding = isLargerScreen ? 3 : 2;
    const modalHeight = isLargerScreen ? getWindowHeight() / 3.5 : getWindowHeight() / 3;
    const modalWidth = isLargerScreen ? getWindowHeight() / 3 : getWindowHeight() / 2.5;
    const fullDatePretty = getDatePrettyFullMonth(plannedDay.date ?? new Date());

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
                            numberOfLines={1}
                            style={{
                                fontSize: 20,
                                width: '100%',
                                fontFamily: POPPINS_MEDIUM,
                                color: colors.accent_color,
                                paddingRight: TIMELINE_CARD_PADDING,
                            }}
                        >
                            {plannedHabit.title}
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
                    <Text style={{ fontFamily: POPPINS_SEMI_BOLD }}>Edit this habit </Text>
                    for
                    <Text style={{ fontFamily: POPPINS_SEMI_BOLD, color: colors.accent_color }}>
                        {' '}
                        {fullDatePretty}{' '}
                    </Text>
                    or edit the entire schedule
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
                        dismiss();
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 14,
                            fontFamily: POPPINS_REGULAR,
                            color: colors.text,
                            paddingVertical: buttonPadding,
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
                        dismiss();
                        if (plannedHabit.id) {
                            editPlannedHabit(plannedHabit.id);
                        } else if (plannedHabit.scheduledHabitId && plannedDay.dayKey) {
                            const newPlannedHabitData: NewPlannedHabitData = {
                                timeOfDay: plannedHabit.timeOfDay,
                                scheduledHabitId: plannedHabit.scheduledHabitId,
                                originalTimeOfDayId: plannedHabit.originalTimeOfDayId,
                                dayKey: plannedDay.dayKey,
                            };
                            editNewPlannedHabit(newPlannedHabitData);
                        }
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 14,
                            fontFamily: POPPINS_REGULAR,
                            color: colors.text,
                            paddingVertical: buttonPadding,
                        }}
                    >
                        Edit For {fullDatePretty}
                    </Text>
                </TouchableOpacity>

                <View style={{ height: TIMELINE_CARD_PADDING }} />

                <TouchableOpacity
                    style={{
                        width: '100%',
                        borderRadius: 6,
                    }}
                    onPress={() => {
                        editScheduledHabit(plannedHabit.scheduledHabitId ?? 0);
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
                        edit schedule
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
                            dismiss();
                        }
                    }}
                >
                    <View
                        style={{
                            width: modalWidth,
                            height: modalHeight,
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
