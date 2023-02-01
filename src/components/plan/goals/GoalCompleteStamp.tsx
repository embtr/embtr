import { Text, View } from 'react-native';
import { TaskCompleteSymbol } from 'src/components/common/task_symbols/TaskCompleteSymbol';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { GoalModel } from 'src/controller/planning/GoalController';
import { GoalResultModel } from 'src/controller/timeline/goals/GoalResultController';
import { formatDate, getDatePretty } from 'src/util/DateUtility';
import { POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';

interface Props {
    goalResult: GoalResultModel;
}

export const GoalCompleteStamp = ({ goalResult }: Props) => {
    const { colors } = useTheme();

    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
            }}
        >
            <TaskCompleteSymbol />
            <View style={{ paddingTop: 3, paddingLeft: 5 }}>
                <Text
                    style={{
                        fontFamily: POPPINS_SEMI_BOLD,
                        fontSize: 12,
                        color: colors.progress_bar_complete,
                    }}
                >
                    Completed
                </Text>
                <Text style={{ bottom: 3, fontSize: 10, opacity: 0.75, fontFamily: POPPINS_REGULAR }}>
                    On{' '}
                    <Text style={{ fontSize: 10, opacity: 0.75, fontFamily: POPPINS_REGULAR, fontWeight: 'bold' }}>
                        {formatDate(goalResult.data.completionDate.toDate())}
                    </Text>
                </Text>
            </View>
        </View>
    );
};
