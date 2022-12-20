import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PillarModel } from 'src/model/PillarModel';
import PillarController from 'src/controller/pillar/PillarController';
import UserController from 'src/controller/user/UserController';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import GoalController, { GoalModel } from 'src/controller/planning/GoalController';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { GoalPreview } from './GoalPreview';

export const GoalPreviews = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const [goals, setGoals] = React.useState<GoalModel[]>([]);
    const [pillars, setPillars] = React.useState<PillarModel[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            GoalController.getGoals(getCurrentUid(), setGoals);
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            const fetch = async () => {
                const user = await UserController.getCurrentUser();
                const pillars = await PillarController.getPillars(user);
                setPillars(pillars);
            };

            fetch();
        }, [])
    );

    let goalPreviews: JSX.Element[] = [];
    for (let i = 0; i < (goals.length <= 3 ? goals.length : 3); i++) {
        const goal = goals[i];

        goalPreviews.push(
            <View key={goal.id} style={{ paddingBottom: 5, width: '100%', alignItems: 'center' }}>
                <GoalPreview goal={goal} pillars={pillars} />
            </View>
        );
    }

    return (
        <View>
            <View style={{ flexDirection: 'row', paddingBottom: 3 }}>
                <View style={{ flex: 1, justifyContent: 'flex-end', paddingLeft: 10 }}>
                    <Text style={{ color: colors.text, fontSize: 18, fontFamily: POPPINS_SEMI_BOLD }}>Goals</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <Text
                        style={{ textAlign: 'right', paddingRight: 10, color: colors.tab_selected, fontSize: 14, fontFamily: POPPINS_SEMI_BOLD }}
                        onPress={() => {
                            navigation.navigate('Goals');
                        }}
                    >
                        See all
                    </Text>
                </View>
            </View>
            <View style={{ paddingTop: 10, paddingBottom: 0 }}>{goalPreviews}</View>
        </View>
    );
};
