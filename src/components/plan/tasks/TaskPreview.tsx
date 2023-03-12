import { View, Text, Button, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import Toast from 'react-native-root-toast';
import React from 'react';
import PlannedTaskController from 'src/controller/planning/PlannedTaskController';
import { PlannedDayModel } from 'resources/models/PlannedDayModel';
import { TaskModel } from 'resources/models/TaskModel';

interface Props {
    plannedDay: PlannedDayModel;
    task: TaskModel;
}

export const TaskPreview = ({ plannedDay, task }: Props) => {
    const { colors } = useTheme();

    const [add, setAdded] = React.useState(false);

    return (
        <View style={{ width: '97%' }}>
            <View style={[{ backgroundColor: colors.timeline_card_background, borderRadius: 9 }, CARD_SHADOW]}>
                <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5 }}>
                    <View style={{ flex: 1, paddingLeft: 10 }}>
                        <Text style={{ color: colors.goal_primary_font, fontFamily: POPPINS_SEMI_BOLD, fontSize: 14 }}>{task.title}</Text>
                        <Text style={{ color: colors.goal_secondary_font, opacity: 0.9, fontFamily: POPPINS_REGULAR, fontSize: 10 }}>{task.description}</Text>
                    </View>

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 15 }}>
                        {add ? (
                            <TouchableOpacity
                                onPress={() => {
                                    setAdded(!add);
                                    Toast.show('task added!', {
                                        duration: Toast.durations.LONG,
                                    });
                                }}
                                style={{
                                    width: '40%',
                                    height: 30,
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderColor: colors.progress_bar_complete,
                                    borderWidth: 1,
                                }}
                            >
                                <Text style={{ color: colors.secondary_text }}>added</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() => {
                                    PlannedTaskController.addTaskViaApi(plannedDay, task);
                                    setAdded(!add);
                                    Toast.show('task added!', {
                                        duration: Toast.durations.LONG,
                                    });
                                }}
                                style={{
                                    width: '40%',
                                    height: 30,
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderColor: colors.secondary_border,
                                    borderWidth: 1,
                                }}
                            >
                                <Text style={{ color: colors.secondary_text }}>add</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};
