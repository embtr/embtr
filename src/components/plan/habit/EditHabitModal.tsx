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
import { getDatePrettyFullMonth } from 'src/util/DateUtility';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import {
    getEditModalPlannedTask,
    getSelectedDayKey,
    setEditModalPlannedTask,
    setUpdateModalPlannedTask,
} from 'src/redux/user/GlobalState';
import { getDateFromDayKey } from 'src/controller/planning/PlannedDayController';
import { DEFAULT_UPDATE_MODAL_PLANNED_TASK } from 'src/model/GlobalState';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Routes } from 'src/navigation/RootStackParamList';
import { NewPlannedHabitData } from 'src/model/PlannedHabitModels';

export const EditHabitModal = () => {
    const { colors } = useTheme();
    const dispatch = useAppDispatch();

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const dayKey = useAppSelector(getSelectedDayKey);
    const plannedHabitData = useAppSelector(getEditModalPlannedTask);
    const plannedHabit = plannedHabitData.plannedTask;

    const dismiss = () => {
        dispatch(setEditModalPlannedTask(DEFAULT_UPDATE_MODAL_PLANNED_TASK));
    };

    const isLargerScreen = getWindowHeight() > 800;
    const buttonPadding = isLargerScreen ? 3 : 2;
    const modalHeight = isLargerScreen ? getWindowHeight() / 3.5 : getWindowHeight() / 3;
    const modalWidth = isLargerScreen ? getWindowHeight() / 3 : getWindowHeight() / 2.5;
    const date = dayKey ? getDateFromDayKey(dayKey) : new Date();
    const fullDatePretty = getDatePrettyFullMonth(date);

    const svgUri = plannedHabit.iconUrl;

    const navigateToEditPlannedHabit = (id: number) => {
        dismiss();

        setTimeout(() => {
            navigation.navigate(Routes.EDIT_PLANNED_HABIT, {
                plannedTaskId: id,
            });
        }, 0);
    };
    const navigateToEditNewPlannedHabit = (data: NewPlannedHabitData) => {
        dismiss();

        setTimeout(() => {
            navigation.navigate(Routes.EDIT_PLANNED_HABIT, {
                newPlannedHabitData: data,
            });
        }, 0);
    };

    const navigateToEditScheduledHabit = (id: number) => {
        dismiss();

        setTimeout(() => {
            navigation.navigate(Routes.CREATE_EDIT_SCHEDULED_HABIT, {
                scheduledHabitId: id,
            });
        }, 0);
    };

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
                        {svgUri && <SvgUri width={25} height={25} uri={svgUri} />}
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
                    onPress={() => {
                        if (plannedHabit.id) {
                            navigateToEditPlannedHabit(plannedHabit.id);
                        } else if (plannedHabit.scheduledHabitId && dayKey) {
                            const newPlannedHabitData: NewPlannedHabitData = {
                                timeOfDay: plannedHabit.timeOfDay,
                                scheduledHabitId: plannedHabit.scheduledHabitId,
                                originalTimeOfDayId: plannedHabit.originalTimeOfDayId,
                                dayKey: dayKey,
                            };
                            navigateToEditNewPlannedHabit(newPlannedHabitData);
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
                        navigateToEditScheduledHabit(plannedHabit.scheduledHabitId ?? 0);
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

    const visible = !!plannedHabitData.plannedTask.title;

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
