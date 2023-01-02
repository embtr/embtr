import { View, Text, TouchableOpacity } from 'react-native';
import { CARD_SHADOW } from 'src/util/constants';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu, getOpenMenu, setMenuOptions } from 'src/redux/user/GlobalState';
import React from 'react';
import { RoutineHabitModel } from 'src/controller/routine/RoutineHabitController';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { SchedulePlannableTaskModal } from '../SchedulePlannableTaskModal';
import { createEmbtrMenuOptions, EmbtrMenuOption } from 'src/components/common/menu/EmbtrMenuOption';
import { startMinuteToString, durationToString } from 'src/controller/planning/TaskController';
import GoalController, { FAKE_GOAL, GoalModel } from 'src/controller/planning/GoalController';

interface Props {
    routineHabit: RoutineHabitModel;
    onUpdateRoutineHabit: Function;
}

export const RoutineHabit = ({ routineHabit, onUpdateRoutineHabit }: Props) => {
    const { colors } = useTheme();
    const [showScheduleModal, setShowScheduleModal] = React.useState<boolean>(false);
    const [goal, setGoal] = React.useState<GoalModel>(FAKE_GOAL);

    React.useEffect(() => {
        if (routineHabit.habit?.goalId) {
            GoalController.getGoal(routineHabit.uid, routineHabit.habit.goalId, setGoal);
        }
    }, []);

    const dispatch = useAppDispatch();
    const openMenu = useAppSelector(getOpenMenu);
    const closeMenu = useAppSelector(getCloseMenu);

    const updateMenuOptions = () => {
        let menuOptions: EmbtrMenuOption[] = [];
        menuOptions.push({
            name: 'Schedule',
            onPress: () => {
                closeMenu();
                setShowScheduleModal(true);
            },
        });

        menuOptions.push({ name: 'Delete', onPress: () => {
            markAsDeleted();
            closeMenu();
        }, destructive: true });

        dispatch(setMenuOptions(createEmbtrMenuOptions(menuOptions)));
    };

    const markAsDeleted = () => {
        const clone = {... routineHabit};
        clone.active = false;
        onUpdateRoutineHabit(clone);
    }

    const createUpdatedRoutineHabit = (startMinute: number, duration: number): RoutineHabitModel => {
        const clone = { ...routineHabit };
        clone.startMinute = startMinute;
        clone.duration = duration;

        return clone;
    };

    const startTime = startMinuteToString(routineHabit.startMinute);
    const duration = durationToString(routineHabit.duration);

    return (
        <View style={{ width: '100%' }}>
            <SchedulePlannableTaskModal
                name={routineHabit.habit.name}
                description={routineHabit.habit.description}
                initialStartMinute={routineHabit.startMinute}
                initialDuration={routineHabit.duration}
                visible={showScheduleModal}
                confirm={(startMinute: number, duration: number) => {
                    const updatedRoutineHabit = createUpdatedRoutineHabit(startMinute, duration);
                    onUpdateRoutineHabit(updatedRoutineHabit);
                    setShowScheduleModal(false);
                }}
                dismiss={() => {
                    setShowScheduleModal(false);
                }}
            />

            <TouchableOpacity
                onPress={() => {
                    updateMenuOptions();
                    openMenu();
                }}
            >
                <View style={[{ backgroundColor: colors.button_background, borderRadius: 15 }, CARD_SHADOW]}>
                    <View style={{ borderRadius: 15, flexDirection: 'row', overflow: 'hidden' }}>
                        <View style={{ width: '100%', paddingTop: 5, paddingBottom: 5 }}>
                            <View style={{ paddingLeft: 10, flexDirection: 'row' }}>
                                <Text
                                    style={{
                                        color: colors.goal_primary_font,
                                        fontFamily: 'Poppins_600SemiBold',
                                        fontSize: 14,
                                    }}
                                >
                                    {routineHabit.habit.name}
                                </Text>
                                <Text
                                    style={{
                                        color: colors.tab_selected,
                                        fontFamily: 'Poppins_400Regular',
                                        fontSize: 9,
                                        paddingStart: 5,
                                    }}
                                >
                                    habit
                                </Text>
                            </View>

                            <View style={{ paddingTop: 8, marginLeft: 10, marginRight: 10 }}>
                                <HorizontalLine />
                            </View>

                            <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 2 }}>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                                    <Ionicons name={'time'} size={12} color={colors.goal_secondary_font} />
                                    <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: 'Poppins_400Regular', fontSize: 10 }}>
                                        {startTime}
                                    </Text>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                                    <MaterialCommunityIcons name="timer" size={12} color={colors.goal_secondary_font} />
                                    <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: 'Poppins_400Regular', fontSize: 10 }}>
                                        {duration}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                                    <Ionicons name={'stats-chart-outline'} size={12} color={colors.goal_secondary_font} />
                                    <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: 'Poppins_400Regular', fontSize: 10 }}>
                                        {goal.name}
                                    </Text>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                                    <MaterialCommunityIcons name="pillar" size={12} color={colors.goal_secondary_font} />
                                    <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: 'Poppins_400Regular', fontSize: 10 }}>
                                        pillar 1
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};
