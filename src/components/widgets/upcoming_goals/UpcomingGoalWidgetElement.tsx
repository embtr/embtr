import { differenceInDays } from 'date-fns';
import { Text, View } from 'react-native';
import { ProgressBar } from 'src/components/plan/goals/ProgressBar';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { GoalModel } from 'src/controller/planning/GoalController';
import { POPPINS_REGULAR } from 'src/util/constants';

interface Props {
    goal: GoalModel;
}

export const UpcomingGoalWidgetElement = ({ goal }: Props) => {
    const { colors } = useTheme();

    const totalDays = differenceInDays(goal.deadline.toDate(), goal.added.toDate());
    const daysRemaining = differenceInDays(goal.deadline.toDate(), new Date());
    const daysPassed = totalDays - daysRemaining;
    const daysRemainingPercent = Math.min(100, Math.floor((daysPassed / totalDays) * 100));

    return (
        <View style={{ width: '100%' }}>
            <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontFamily: POPPINS_REGULAR }}>{goal.name}</Text>
                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'flex-start' }}>
                        <ProgressBar progress={daysRemainingPercent} />
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
