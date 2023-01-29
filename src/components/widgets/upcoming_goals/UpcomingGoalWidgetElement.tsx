import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { differenceInDays } from 'date-fns';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ProgressBar } from 'src/components/plan/goals/ProgressBar';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { getProgressPercent, GoalModel } from 'src/controller/planning/GoalController';
import { PlanTabScreens, ProfileTabScreens } from 'src/navigation/RootStackParamList';
import { POPPINS_REGULAR } from 'src/util/constants';

interface Props {
    goal: GoalModel;
}

export const UpcomingGoalWidgetElement = ({ goal }: Props) => {
    const { colors } = useTheme();

    const daysRemaining = differenceInDays(goal.deadline.toDate(), new Date());
    const progressPercent = getProgressPercent(goal);

    const navigation = useNavigation<StackNavigationProp<ProfileTabScreens>>();
    const navigateToDetails = () => {
        if (goal.id) {
            navigation.navigate('GoalDetails', { uid: goal.uid, id: goal.id });
        }
    };

    return (
        <View style={{ width: '100%' }}>
            <TouchableOpacity onPress={navigateToDetails}>
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
            </TouchableOpacity>
        </View>
    );
};
