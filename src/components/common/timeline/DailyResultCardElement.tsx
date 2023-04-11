import * as React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TouchableWithoutFeedback } from 'react-native';
import { TaskFailedSymbol } from '../task_symbols/TaskFailedSymbol';
import { TaskCompleteSymbol } from '../task_symbols/TaskCompleteSymbol';
import { TaskInProgressSymbol } from '../task_symbols/TaskInProgressSymbol';
import { PlannedTask as PlannedTaskModel } from 'resources/schema';

interface Props {
    plannedTask: PlannedTaskModel;
    onPress?: Function;
}

export const DailyResultCardElement = ({ plannedTask, onPress }: Props) => {
    const { colors } = useTheme();
    const [temporaryStatus, setTemporaryStatus] = React.useState('');

    let status = plannedTask.status;
    if (temporaryStatus) {
        status = temporaryStatus;
    }
    if (status === undefined) {
        status = 'INCOMPLETE';
    }

    //clear status once render catches up
    if (plannedTask.status === temporaryStatus) {
        setTemporaryStatus('');
    }

    let durationString = '';

    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableWithoutFeedback
                    disabled={!onPress}
                    onPress={() => {
                        if (onPress) {
                            onPress(plannedTask, status, setTemporaryStatus);
                        }
                    }}
                >
                    {status === 'FAILED' ? <TaskFailedSymbol /> : status === 'COMPLETE' ? <TaskCompleteSymbol /> : <TaskInProgressSymbol />}
                </TouchableWithoutFeedback>

                {/*
                old impl used to have have a second line for the task description

                <View style={{ paddingLeft: 5 }}>
                    <Text style={{ color: colors.goal_primary_font, fontFamily: 'Poppins_600SemiBold', fontSize: 12 }}>{plannedTask.task?.title}</Text>
                    <Text style={{ color: colors.goal_secondary_font, fontFamily: 'Poppins_400Regular', fontSize: 9 }}></Text>
                </View>*/}

                <View style={{ paddingLeft: 5 }}>
                    <Text style={{ color: colors.goal_primary_font, fontFamily: 'Poppins_600SemiBold', fontSize: 12 }}>{plannedTask.task?.title}</Text>
                </View>
            </View>
        </View>
    );
};
