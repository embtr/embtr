import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TaskModel } from 'src/controller/planning/TaskController';
import { getStartTimePretty, PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { CARD_SHADOW } from 'src/util/constants';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PillarModel } from 'src/model/PillarModel';
import { GoalModel } from 'src/controller/planning/GoalController';
import { SchedulePlannableTaskModal } from 'src/components/plan/SchedulePlannableTaskModal';

interface Props {
    plannedTask?: PlannedTaskModel,
    task?: TaskModel,
    locked: boolean,
    onPress?: Function,
    onUpdate?: Function,
    isEnabled: boolean,
    goal: GoalModel,
    pillar: PillarModel
}

export const PlannableTask = ({ plannedTask, task, locked, onPress, onUpdate, isEnabled, goal, pillar }: Props) => {
    const { colors } = useTheme();

    const [visible, setVisible] = React.useState(false);

    const onConfirm = (startTime: number, duration: number) => {
        if (onUpdate && plannedTask) {
            onUpdate(plannedTask.routine.id ? plannedTask.routine.id : plannedTask.id, startTime, duration);
        }

        setVisible(false);
    };

    const onDismiss = () => {
        setVisible(false);
    };

    return (
        <View style={{ width: "97%" }}>
            {plannedTask && <SchedulePlannableTaskModal plannedTask={plannedTask} visible={visible} confirm={onConfirm} dismiss={onDismiss} />}

            <TouchableOpacity onPress={() => { if (locked) setVisible(true); else if (onPress) { onPress(task?.id, !isEnabled) } }} >
                <View style={[{ backgroundColor: isEnabled ? colors.button_background : colors.tomorrow_unselected, borderRadius: 15 }, CARD_SHADOW]}>
                    <View style={{ borderRadius: 15, flexDirection: "row", overflow: "hidden" }}>
                        <View style={{ width: "2%", height: "100%", backgroundColor: isEnabled ? colors.tomorrow_selected_indicator : colors.tomorrow_unselected }} />

                        <View style={{ width: "98%" }}>
                            <View style={{ paddingLeft: 10 }}>
                                <Text style={{ color: colors.goal_primary_font, fontFamily: "Poppins_600SemiBold", fontSize: 14 }}>
                                    {plannedTask?.routine?.name ? plannedTask.routine.name : task?.name ? task.name : ""}
                                </Text>

                                <Text style={{ color: colors.goal_primary_font, fontFamily: "Poppins_400Regular", opacity: .75, fontSize: 10, paddingTop: 3 }}>{plannedTask?.routine?.description ? plannedTask?.routine?.description : task?.description}</Text>
                            </View>

                            <View style={{ paddingTop: 8, marginLeft: 10, marginRight: 10 }}>
                                <HorizontalLine />
                            </View>

                            {locked ?
                                <View style={{ flexDirection: "row", paddingTop: 10, paddingBottom: 10 }}>
                                    <View style={{ flex: 1, flexDirection: "row", paddingLeft: 10, alignItems: "center" }}>
                                        <Ionicons name={'time-outline'} size={14} color={colors.goal_secondary_font} />
                                        <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: "Poppins_400Regular", fontSize: 12 }}>{getStartTimePretty(plannedTask!)}</Text>
                                    </View>

                                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center", paddingRight: 30 }}>
                                        <Ionicons name={'timer-outline'} size={14} color={colors.goal_secondary_font} />
                                        <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: "Poppins_400Regular", fontSize: 12 }}>{plannedTask?.duration} minutes</Text>
                                    </View>
                                </View>
                                :
                                <View style={{ flexDirection: "row", paddingTop: 10, paddingBottom: 10 }}>
                                    <View style={{ flex: 1, flexDirection: "row", paddingLeft: 10, alignItems: "center" }}>
                                        <Ionicons name={'stats-chart-outline'} size={14} color={colors.goal_secondary_font} />
                                        <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: "Poppins_400Regular", fontSize: 12 }}>{goal.name}</Text>
                                    </View>

                                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center", paddingRight: 30 }}>
                                        <MaterialCommunityIcons name="pillar" size={14} color={colors.goal_secondary_font} />
                                        <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: "Poppins_400Regular", fontSize: 12 }}>{pillar.name}</Text>
                                    </View>
                                </View>
                            }
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};