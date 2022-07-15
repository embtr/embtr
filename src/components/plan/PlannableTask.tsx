import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, ColorValue, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TaskModel } from 'src/controller/planning/TaskController';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { CARD_SHADOW } from 'src/util/constants';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

interface Props {
    plannedTask?: PlannedTaskModel,
    task?: TaskModel,
    locked: boolean,
    onPress?: Function,
    onUpdate?: Function,
    isEnabled: boolean
}

export const PlannableTask = ({ plannedTask, task, locked, onPress, onUpdate, isEnabled }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const [hour, setHour] = React.useState(plannedTask?.startMinute ? Math.floor(plannedTask.startMinute / 60) : 1);
    const [minute, setMinute] = React.useState(plannedTask?.startMinute ? Math.floor(plannedTask.startMinute % 60) : 0);
    const [AMPM, setAMPM] = React.useState(plannedTask?.startMinute && plannedTask.startMinute - 720 >= 0 ? "PM" : "AM");
    const [durationMinutes, setDurationMinutes] = React.useState(plannedTask?.duration ? plannedTask.duration / 5 : 0);

    const navigateToDetails = () => {
        if (plannedTask) {
            navigation.navigate('TaskDetails', { id: plannedTask.routine.id! })
        } else if (task) {
            navigation.navigate('TaskDetails', { id: task?.id! })
        }
    };

    return (
        <View style={{ width: "97%" }}>
            <TouchableOpacity onPress={() => { if (onPress) { onPress(task?.id, !isEnabled) } }} >
                <View style={[{ backgroundColor: colors.button_background, borderRadius: 15, flexDirection: "row", overflow: "hidden" }, CARD_SHADOW]}>
                    <View style={{ width: "2%", height: "100%", backgroundColor: isEnabled ? "green" : colors.button_background }} />

                    <View style={{ width: "98%" }}>
                        <View style={{ paddingLeft: 10 }}>
                            <Text style={{ color: colors.goal_primary_font, fontFamily: "Poppins_600SemiBold", fontSize: 14 }}>
                                {plannedTask?.routine?.name ? plannedTask.routine.name : task?.name ? task.name : ""}
                            </Text>

                            <Text style={{ color: colors.goal_primary_font, fontFamily: "Poppins_400Regular", opacity: .75, fontSize: 10, paddingTop: 3 }}>{task?.description}</Text>
                        </View>

                        <View style={{ paddingTop: 8, marginLeft: 10, marginRight: 10 }}>
                            <HorizontalLine />
                        </View>

                        <View style={{ flexDirection: "row", paddingTop: 10, paddingBottom: 10 }}>

                            <View style={{ flex: 1, flexDirection: "row", paddingLeft: 10, alignItems: "center" }}>
                                <Ionicons name={'stats-chart-outline'} size={14} color={colors.goal_secondary_font} />
                                <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: "Poppins_400Regular", fontSize: 12 }}>Goal Name</Text>
                            </View>

                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center", paddingRight: 30 }}>
                                <MaterialCommunityIcons name="pillar" size={14} color={colors.goal_secondary_font} />
                                <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: "Poppins_400Regular", fontSize: 12 }}>Pillar Name</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};