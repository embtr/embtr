import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getAuth } from 'firebase/auth';
import React from 'react';
import { View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import { Goal } from 'src/components/plan/goals/Goal';
import { useTheme } from 'src/components/theme/ThemeProvider';
import PillarController from 'src/controller/pillar/PillarController';
import GoalController, { GoalModel } from 'src/controller/planning/GoalController';
import UserController from 'src/controller/user/UserController';
import { PillarModel } from 'src/model/PillarModel';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';

export const Goals = () => {
    const [goals, setGoals] = React.useState<GoalModel[]>([]);
    const [pillars, setPillars] = React.useState<PillarModel[]>([]);

    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    useFocusEffect(
        React.useCallback(() => {
            GoalController.getGoals(getAuth().currentUser!.uid, setGoals);
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            fetchPillars();
        }, [])
    );

    const fetchPillars = async () => {
        const user = await UserController.getCurrentUser();
        const pillars = await PillarController.getPillars(user);
        setPillars(pillars);
    };

    let goalViews: JSX.Element[] = [];
    goals.forEach((goal) => {
        goalViews.push(
            <View key={goal.id} style={{ paddingBottom: 7.5, width: '100%', alignItems: 'center' }}>
                <Goal goal={goal} pillars={pillars} />
            </View>
        );
    });

    return (
        <Screen>
            <Banner name={'Goals'} leftText={'back'} leftRoute="BACK" />

            {goalViews.length > 0 ? (
                <ScrollView style={{ paddingTop: 7 }}>{goalViews}</ScrollView>
            ) : (
                <View style={{ height: '97%', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: colors.secondary_text, paddingLeft: 40, paddingRight: 40 }}>You have no goals... Let's change that!</Text>
                    <Text
                        onPress={() => {
                            navigation.navigate('CreateEditGoal', { id: undefined });
                        }}
                        style={{ color: colors.tab_selected, fontFamily: 'Poppins_400Regular' }}
                    >
                        {' '}
                        create a goal
                    </Text>
                </View>
            )}
        </Screen>
    );
};
