import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import Toast from 'react-native-root-toast';
import React from 'react';
import PlannedTaskController from 'src/controller/planning/PlannedTaskController';
import { PlannedDay as PlannedDayModel } from 'resources/schema';
import { Task as TaskModel } from 'resources/schema';
import TaskController from 'src/controller/planning/TaskController';
import { Ionicons } from '@expo/vector-icons';
import { HabitScrollSelector } from './HabitScrollSelector';

/* Pog I was here - Cherkim */

interface Props {
    plannedDay: PlannedDayModel;
    task: TaskModel;
    index: number;
}

export const TaskPreview = ({ plannedDay, task, index }: Props) => {
    const { colors } = useTheme();

    const [add, setAdded] = React.useState(false);
    const [isExpanded, setIsExpanded] = React.useState(false);
    const heightValue = React.useRef(new Animated.Value(0)).current;

    const toggleExpand = () => {
        Animated.timing(heightValue, {
            toValue: isExpanded ? 0 : 55, // Set the target height value to 0 or the height you want to expand to
            duration: 100, // Set the duration of the animation
            useNativeDriver: false, // Make sure to set useNativeDriver to false for layout animations
        }).start();

        setIsExpanded(!isExpanded);
    };

    return (
        <View style={{ width: '97%' }}>
            <View
                style={[
                    { backgroundColor: colors.timeline_card_background, borderRadius: 9 },
                    CARD_SHADOW,
                ]}
            >
                <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5 }}>
                    <View style={{ flex: 1, paddingLeft: 10 }}>
                        <Text
                            style={{
                                color: colors.goal_primary_font,
                                fontFamily: POPPINS_SEMI_BOLD,
                                fontSize: 14,
                            }}
                        >
                            {task.title}
                        </Text>
                        <Text
                            style={{
                                color: colors.goal_secondary_font,
                                opacity: 0.9,
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 10,
                            }}
                        >
                            {task.description}
                        </Text>
                    </View>

                    <View
                        style={{
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            flexDirection: 'row',
                            flex: 1,
                        }}
                    >
                        <TouchableOpacity
                            onPress={toggleExpand}
                            style={{
                                height: 30,
                                borderRadius: 5,
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                            }}
                        >
                            <Ionicons name="chevron-down-outline" size={30} color={'white'} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={async () => {
                                let taskToAdd = task;

                                if (!task.id) {
                                    taskToAdd = await TaskController.createViaApi(task.title!);
                                }
                                PlannedTaskController.addTaskViaApi(plannedDay, taskToAdd);
                                setAdded(!add);
                                Toast.show('task added!', {
                                    duration: Toast.durations.LONG,
                                });
                            }}
                            style={{
                                height: 30,
                                borderRadius: 5,
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                paddingRight: 10,
                                paddingLeft: 10,
                            }}
                        >
                            <Ionicons
                                name="md-add-circle-outline"
                                size={30}
                                color={add ? 'green' : colors.toggle_background_selected}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <Animated.View style={{ height: heightValue }}>
                    <HabitScrollSelector />
                </Animated.View>
            </View>
        </View>
    );
};
