import { differenceInDays } from 'date-fns';
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import GoalController, { GoalModel } from 'src/controller/planning/GoalController';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { WidgetBase } from '../WidgetBase';
import { UpcomingGoalWidgetElement } from './UpcomingGoalWidgetElement';

interface Props {
    refreshedTimestamp: Date;
    uid: string;
}

export const UpcomingGoalsWidget = ({ uid, refreshedTimestamp }: Props) => {
    const { colors } = useTheme();
    const [goals, setGoals] = React.useState<GoalModel[]>();

    React.useEffect(() => {
        fetch();
    }, [refreshedTimestamp]);

    const fetch = () => {
        GoalController.getGoals(uid, (goals: GoalModel[]) => {
            goals = goals.reverse();
            setGoals(goals);
        });
    };

    let goalViews: JSX.Element[] = [];
    if (goals) {
        for (let i = 0; i < goals?.length; i++) {
            const goal = goals[i];
            const daysRemaining = differenceInDays(goal.deadline.toDate(), new Date());
            if (daysRemaining < 0) {
                continue;
            }
            goalViews.push(
                <View style={{ paddingTop: i > 0 ? 5 : 0 }}>
                    <UpcomingGoalWidgetElement goal={goal} />
                </View>
            );
        }
    }

    return (
        <WidgetBase>
            <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>Upcoming Goals</Text>
            <View style={{ paddingTop: 10 }}>{goalViews}</View>
        </WidgetBase>
    );
};
