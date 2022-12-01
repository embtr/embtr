import { format } from 'date-fns';
import { View, Text } from 'react-native';
import { TaskCompleteSymbol } from 'src/components/common/task_symbols/TaskCompleteSymbol';
import { TaskFailedSymbol } from 'src/components/common/task_symbols/TaskFailedSymbol';
import { TaskInProgressSymbol } from 'src/components/common/task_symbols/TaskInProgressSymbol';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { getDateFromDayKey } from 'src/controller/planning/PlannedDayController';
import { HabitHistoryElementModel } from 'src/controller/planning/TaskController';
import { POPPINS_REGULAR } from 'src/util/constants';

interface Props {
    history: HabitHistoryElementModel;
}

export const GorlHistory = ({ history }: Props) => {
    const { colors } = useTheme();

    return (
        <View
            style={{
                backgroundColor: colors.button_background,
                borderRadius: 15,
                width: '95%',
                height: 65,
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
            }}
        >
            <View style={{ paddingLeft: 10 }}>
                {history.status === 'COMPLETE' && <TaskCompleteSymbol />}
                {history.status === 'FAILED' && <TaskFailedSymbol />}
                {history.status === 'INCOMPLETE' || (!history.status && <TaskInProgressSymbol />)}
            </View>

            <View style={{ paddingLeft: 10 }}>
                <Text style={{ fontFamily: POPPINS_REGULAR, fontSize: 12, color: colors.goal_primary_font }}>{history.name}</Text>
                <Text style={{ opacity: 0.75, fontFamily: POPPINS_REGULAR, fontSize: 10, paddingLeft: 1, color: colors.goal_secondary_font }}>
                    {format(getDateFromDayKey(history.dayKey), 'MMMM dd, yyyy')}
                </Text>
            </View>
        </View>
    );
};
