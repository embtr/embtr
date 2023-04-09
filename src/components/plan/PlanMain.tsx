import React from 'react';
import { View, Text } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { SceneRendererProps, TabView, TabBar } from 'react-native-tab-view';
import { Banner } from 'src/components/common/Banner';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { PlanPreviews } from './PlanPreviews';
import { Planning } from './planning/Planning';
import { Tasks } from './tasks/Tasks';
import { EmbtrMenuOption, createEmbtrMenuOptions } from '../common/menu/EmbtrMenuOption';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';
import PlannedDayController from 'src/controller/planning/PlannedDayController';

/*
 * Avoid rerenders
 * https://github.com/satya164/react-native-tab-view#avoid-unnecessary-re-renders
 */

export const PlanMain = () => {
    const { colors } = useTheme();
    const [showAddTaskModal, setShowAddTaskModal] = React.useState(false);
    const [useCalendarView, setUseCalendarView] = React.useState<boolean>(false);
    const [selectedDayKey, setSelectedDayKey] = React.useState<string>('');

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const renderScene = (props: SceneRendererProps & { route: { key: string; title: string } }) => {
        switch (props.route.key) {
            case 'planning':
                return (
                    <Planning
                        showSelectTaskModal={showAddTaskModal}
                        dismissSelectTaskModal={() => {
                            setShowAddTaskModal(false);
                        }}
                        openSelectTaskModal={() => {
                            setShowAddTaskModal(true);
                        }}
                        onDayChange={setSelectedDayKey}
                        useCalendarView={useCalendarView}
                    />
                );

            case 'habits':
                return <PlanPreviews />;

            case 'tasks':
                return <Tasks />;
        }

        return <View />;
    };

    const [index, setIndex] = React.useState(0);

    const [routes] = React.useState([
        { key: 'planning', title: 'Schedule' },
        { key: 'habits', title: 'Plan' },
        { key: 'tasks', title: 'Tasks' },
    ]);

    const navigateToTomorrowCreateTask = () => {
        setShowAddTaskModal(true);
    };

    const navigateToTasksCreateTask = () => {
        navigation.navigate('CreateEditHabit', { id: undefined });
    };

    const closeMenu = useAppSelector(getCloseMenu);
    const menuItems: EmbtrMenuOption[] = [
        {
            name: 'Complete Day',
            onPress: async () => {
                const plannedDay = await PlannedDayController.getForCurrentUserViaApi(selectedDayKey);
                if (plannedDay) {
                    PlannedDayController.completeDayViaApi(plannedDay);
                }

                closeMenu();
            },
        },
    ];

    return (
        <Screen>
            <View style={{ height: '100%' }}>
                <Banner
                    name={'Planning'}
                    leftIcon={index === 0 ? 'add' : undefined}
                    leftRoute={'CreateTask'}
                    leftOnClick={index === 0 ? navigateToTomorrowCreateTask : navigateToTasksCreateTask}
                    rightIcon={'ellipsis-horizontal'}
                    menuOptions={createEmbtrMenuOptions(menuItems)}
                />

                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    renderTabBar={(props) => (
                        <TabBar
                            {...props}
                            indicatorStyle={{ height: 4, borderRadius: 15, backgroundColor: colors.planning_horizontal_indicator }}
                            renderLabel={({ focused, route }) => {
                                return (
                                    <Text style={{ color: colors.planning_focused_text, fontFamily: 'Poppins_600SemiBold', opacity: focused ? 1.0 : 0.35 }}>
                                        {route.title}
                                    </Text>
                                );
                            }}
                            style={{
                                backgroundColor: colors.background,
                                width: '94%',
                                marginLeft: '3%',
                                shadowOffset: { height: 0, width: 0 },
                                shadowColor: 'transparent',
                                shadowOpacity: 0,
                                elevation: 0,
                            }}
                            indicatorContainerStyle={{ backgroundColor: colors.scroll_tab_background, height: 4, marginTop: 43, borderRadius: 15 }}
                        />
                    )}
                />
            </View>
        </Screen>
    );
};
