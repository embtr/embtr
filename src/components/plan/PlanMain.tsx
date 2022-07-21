import React from 'react';
import { View, Text } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { SceneRendererProps, TabView, TabBar } from 'react-native-tab-view';
import { Banner } from 'src/components/common/Banner';
import { Tasks } from 'src/components/plan/tasks/Tasks';
import { Tomorrow } from 'src/components/plan/tomorrow/Tomorrow';
import { Goals } from 'src/components/plan/goals/Goals';
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlanTabScreens, TodayTab } from 'src/navigation/RootStackParamList';
import { getTomorrowKey } from 'src/controller/planning/PlannedDayController';


/*
 * Avoid rerenders
 * https://github.com/satya164/react-native-tab-view#avoid-unnecessary-re-renders
*/

export const PlanMain = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const renderScene = (props: SceneRendererProps & { route: { key: string; title: string; }; }) => {
        switch (props.route.key) {
            case 'tomorrow':
                return <Tomorrow />

            case 'tasks':
                return <Tasks />

            case 'goals':
                return <Goals />
        }

        return <View></View>
    };

    const [index, setIndex] = React.useState(0);

    const [routes] = React.useState([
        { key: 'tomorrow', title: 'Tomorrow' },
        { key: 'tasks', title: 'Tasks' },
        { key: 'goals', title: 'Goals' },
    ]);

    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
    });

    if (!fontsLoaded) {
        return <View />
    }

    const navigateToTomorrowCreateTask = () => {
        navigation.navigate('CreateOneTimeTask', { dayKey: getTomorrowKey() })
    }

    const navigateToTasksCreateTask = () => {
        navigation.navigate('CreateDailyTask')
    }

    const navigateToCreateGoals = () => {
        navigation.navigate('CreateGoal')
    }

    return (
        <Screen>
            <View style={{ height: "100%" }}>
                <Banner name={"Planning"} leftIcon={"add"} leftRoute={"CreateTask"} leftOnClick={index === 0 ? navigateToTomorrowCreateTask : index === 1 ? navigateToTasksCreateTask : navigateToCreateGoals} />

                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}

                    renderTabBar={props => <TabBar
                        {...props}
                        indicatorStyle={{ height: 4, borderRadius: 15, backgroundColor: colors.planning_horizontal_indicator }}
                        renderLabel={({ focused, route }) => {
                            return (
                                <Text style={{ color: colors.planning_focused_text, fontFamily: "Poppins_600SemiBold", opacity: focused ? 1.0 : .35 }}>
                                    {route.title}
                                </Text>
                            );
                        }}
                        style={{
                            backgroundColor: colors.background,
                            shadowOffset: { height: 0, width: 0 }, shadowColor: 'transparent', shadowOpacity: 0, elevation: 0
                        }}
                    />
                    }
                />
            </View>
        </Screen>
    )
};