import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from 'src/components/theme/ThemeProvider';
import TaskController, { TaskModel } from 'src/controller/planning/TaskController';
import { PillarModel } from 'src/model/PillarModel';
import PillarController from 'src/controller/pillar/PillarController';
import UserController from 'src/controller/user/UserController';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { TaskPreview } from './TaskPreview';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';

export const PlanPreviews = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const [habits, setHabits] = React.useState<TaskModel[]>([]);
    const [pillars, setPillars] = React.useState<PillarModel[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            TaskController.getTasks(getAuth().currentUser!.uid, setHabits);
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

    let taskViews: JSX.Element[] = [];
    habits.forEach((habit) => {
        taskViews.push(
            <View key={habit.id} style={{ paddingBottom: 5, width: '100%', alignItems: 'center' }}>
                <TaskPreview task={habit} pillars={pillars} />
            </View>
        );
    });

    return (
        <View style={{ height: '100%' }}>
            <ScrollView style={{ backgroundColor: colors.background, paddingTop: 7 }}>
                <View style={{ flexDirection: 'row', paddingBottom: 3 }}>
                    <View style={{ flex: 1, justifyContent: 'flex-end', paddingLeft: 10 }}>
                        <Text style={{ color: colors.text, fontSize: 18, fontFamily: POPPINS_SEMI_BOLD }}>Habits</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <Text
                            style={{ textAlign: 'right', paddingRight: 10, color: colors.tab_selected, fontSize: 14, fontFamily: POPPINS_SEMI_BOLD }}
                            onPress={() => {
                                navigation.navigate('Habits');
                            }}
                        >
                            See all
                        </Text>
                    </View>
                </View>
                <View style={{ paddingTop: 10, paddingBottom: 0 }}>{taskViews}</View>
            </ScrollView>
        </View>
    );
};
