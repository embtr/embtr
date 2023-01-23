import { CommonActions, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { differenceInDays } from 'date-fns';
import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { GoalModel } from 'src/controller/planning/GoalController';
import { UserModel } from 'src/controller/user/UserController';
import { MainTabScreens } from 'src/navigation/RootStackParamList';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { WidgetBase } from '../WidgetBase';
import { UpcomingGoalWidgetElement } from './UpcomingGoalWidgetElement';

interface Props {
    user: UserModel;
    goals: GoalModel[];
}

export const UpcomingGoalsWidget = ({ user, goals }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<MainTabScreens>>();

    let goalViews: JSX.Element[] = [];
    if (goals) {
        for (let i = 0; i < goals?.length; i++) {
            const goal = goals[i];
            const daysRemaining = differenceInDays(goal.deadline.toDate(), new Date());
            if (daysRemaining < 0) {
                continue;
            }
            goalViews.push(
                <View key={goal.id + goal.name} style={{ paddingTop: i > 0 ? 5 : 0 }}>
                    <UpcomingGoalWidgetElement goal={goal} />
                </View>
            );
        }
    }

    return (
        <WidgetBase>
            <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>Upcoming Goals</Text>
            {goalViews.length > 0 ? (
                <View style={{ paddingTop: 10 }}>{goalViews}</View>
            ) : user.uid === getCurrentUid() ? (
                <Text style={{ color: colors.text, paddingTop: 5 }}>
                    you have no upcoming goals -{' '}
                    <Text
                        onPress={() => {
                            navigation.dispatch(CommonActions.reset({ index: 2, routes: [{ name: 'PlanMain' }] }));
                            navigation.navigate('PlanTab', { screen: 'CreateEditGoal', params: { id: undefined } });
                        }}
                        style={{ color: colors.tab_selected, fontFamily: 'Poppins_400Regular' }}
                    >
                        create one
                    </Text>
                </Text>
            ) : (
                <Text style={{ color: colors.text, paddingTop: 5 }}>we found no upcoming goals. maybe they're on vacation?</Text>
            )}
        </WidgetBase>
    );
};
