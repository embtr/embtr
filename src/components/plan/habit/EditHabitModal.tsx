import { Modal, TouchableOpacity, View, Text, Pressable } from 'react-native';
import { getWindowHeight } from 'src/util/GeneralUtility';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ModalBase } from 'src/components/common/modal/ModalBase';
import {
    CARD_SHADOW,
    POPPINS_MEDIUM,
    POPPINS_REGULAR,
    POPPINS_SEMI_BOLD,
    PADDING_LARGE,
} from 'src/util/constants';
import { getDatePrettyFullMonth } from 'src/util/DateUtility';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import {
    getEditModalPlannedTask,
    getSelectedDayKey,
    setEditModalPlannedTask,
} from 'src/redux/user/GlobalState';
import { getDateFromDayKey } from 'src/controller/planning/PlannedDayController';
import { DEFAULT_UPDATE_MODAL_PLANNED_TASK } from 'src/model/GlobalState';
import { Routes } from 'src/navigation/RootStackParamList';
import { NewPlannedHabitData } from 'src/model/PlannedHabitModels';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { OptimalImage, OptimalImageData } from 'src/components/common/images/OptimalImage';
import { PlannedTaskUtil } from 'src/util/PlannedTaskUtil';

export const EditHabitModal = () => {
    const { colors } = useTheme();
    const dispatch = useAppDispatch();

    const navigation = useEmbtrNavigation();
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

    const optimalImage: OptimalImageData = {
        localImage: PlannedTaskUtil.getLocalImage(plannedHabit),
        remoteImageUrl: PlannedTaskUtil.getRemoteImageUrl(plannedHabit),
    };

    let date = new Date();
    if (dayKey && dayKey !== '' && dayKey.length === '2021-01-01'.length) {
        try {
            date = getDateFromDayKey(dayKey);
        } catch (error) {
            // 2024-01-21 - android was crashing on release build launch
        }
    }
    const fullDatePretty = getDatePrettyFullMonth(date);

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
                        paddingTop: PADDING_LARGE,
                        paddingLeft: PADDING_LARGE,
                    }}
                >
                    <View style={{ height: 25, width: 25 }}>
                        <OptimalImage data={optimalImage} style={{ height: 25, width: 25 }} />
                    </View>
                    <View style={{ width: PADDING_LARGE / 2 }} />
                    <View style={{ flex: 1 }}>
                        <Text
                            numberOfLines={1}
                            style={{
                                fontSize: 20,
                                width: '100%',
                                fontFamily: POPPINS_MEDIUM,
                                color: colors.text,
                                paddingRight: PADDING_LARGE,
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
                    paddingTop: PADDING_LARGE,
                }}
            >
                <Text
                    style={{
                        fontFamily: POPPINS_REGULAR,
                        paddingHorizontal: PADDING_LARGE,
                        color: colors.text,
                        fontSize: 16,
                    }}
                >
                    Edit thid habit for
                    <Text style={{ fontFamily: POPPINS_MEDIUM, color: colors.accent_color_light }}>
                        {' '}
                        {fullDatePretty}{' '}
                    </Text>
                    or edit the entire schedule.
                </Text>
            </View>

            {/* bottom section */}
            <View
                style={{
                    flex: 1,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingHorizontal: PADDING_LARGE,
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

                <View style={{ height: PADDING_LARGE }} />

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

                <View style={{ height: PADDING_LARGE }} />

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

                <View style={{ height: PADDING_LARGE }} />
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
