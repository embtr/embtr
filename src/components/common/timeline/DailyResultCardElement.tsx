import * as React from 'react';
import { Text, View } from 'react-native';
import { PlannedTaskModel } from 'src/controller/planning/PlannedTaskController';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useFonts, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { startMinuteToString } from 'src/controller/planning/TaskController';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { TaskFailedSymbol } from '../task_symbols/TaskFailedSymbol';
import { TaskCompleteSymbol } from '../task_symbols/TaskCompleteSymbol';
import { TaskInProgressSymbol } from '../task_symbols/TaskInProgressSymbol';

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

    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_600SemiBold,
    });

    if (!fontsLoaded) {
        return <View />;
    }

    let durationString = '';
    if (plannedTask.duration) {
        const hours = Math.floor(plannedTask.duration / 60);
        const minutes = plannedTask.duration - hours * 60;
        if (hours >= 1) {
            durationString += hours + 'h ';
        }

        durationString += minutes + 'm';
    }

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

                <View style={{ paddingLeft: 5 }}>
                    <Text style={{ color: colors.goal_primary_font, fontFamily: 'Poppins_600SemiBold', fontSize: 12 }}>{plannedTask.routine.name}</Text>
                    <Text style={{ color: colors.goal_secondary_font, fontFamily: 'Poppins_400Regular', fontSize: 9 }}>
                        {plannedTask.startMinute ? startMinuteToString(plannedTask.startMinute) : ''} • {durationString}
                    </Text>
                </View>
            </View>
        </View>
    );
};
