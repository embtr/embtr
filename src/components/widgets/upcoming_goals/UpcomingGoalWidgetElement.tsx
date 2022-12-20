import { differenceInDays } from 'date-fns';
import { Text, View } from 'react-native';
import { ProgressBar } from 'src/components/plan/goals/ProgressBar';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { getProgressPercent, GoalModel } from 'src/controller/planning/GoalController';
import { POPPINS_REGULAR } from 'src/util/constants';

interface Props {
    goal: GoalModel;
}

export const UpcomingGoalWidgetElement = ({ goal }: Props) => {
    const { colors } = useTheme();

    const daysRemaining = differenceInDays(goal.deadline.toDate(), new Date());
    const progressPercent = getProgressPercent(goal);

    return (
        <View style={{ width: '100%' }}>
            <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontFamily: POPPINS_REGULAR }}>{goal.name}</Text>
                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'flex-start' }}>
                        <ProgressBar progress={progressPercent} />
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 10 }}>
                        <Text style={{ fontSize: 10, color: colors.text, fontFamily: POPPINS_REGULAR }}>
                            ends in <Text style={{ fontSize: 10, color: colors.tab_selected, fontFamily: POPPINS_REGULAR }}>{daysRemaining}</Text> days
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};
