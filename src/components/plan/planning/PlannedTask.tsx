import { View, Text, ColorValue } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlannedTaskModel } from 'src/controller/planning/PlannedTaskController';
import { durationToString, startMinuteToString } from 'src/controller/planning/TaskController';

interface Props {
    plannedTask: PlannedTaskModel;
    backgroundColor?: ColorValue;
}

export const PlannedTask = ({ plannedTask, backgroundColor }: Props) => {
    const { colors } = useTheme();

    return (
        <View style={{ backgroundColor: backgroundColor || colors.card_background_active }}>
            <View style={{ height: 'auto', paddingTop: 5, paddingBottom: 5 }}>
                <View style={{ padding: 5 }}>
                    <Text style={{ color: colors.text, textAlign: 'center' }}>{plannedTask.routine.name}</Text>
                </View>

                <Text style={{ color: colors.text, textAlign: 'center', paddingTop: 5 }}>
                    {startMinuteToString(plannedTask.startMinute ? plannedTask.startMinute : 0) +
                        ' for ' +
                        durationToString(plannedTask.duration ? plannedTask.duration : 0)}
                </Text>
                <View style={{ flex: 1 }} />
            </View>
        </View>
    );
};
