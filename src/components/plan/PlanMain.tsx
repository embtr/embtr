import React from 'react';
import { View, Text } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { SceneRendererProps, TabView, TabBar } from 'react-native-tab-view';
import { Banner } from 'src/components/common/Banner';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { Planning } from './planning/Planning';
import { EmbtrMenuOption, createEmbtrMenuOptions } from '../common/menu/EmbtrMenuOption';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';
import PlannedDayController, {
    getDayKey,
    getTodayKey,
} from 'src/controller/planning/PlannedDayController';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';

/*
 * Avoid rerenders
 * https://github.com/satya164/react-native-tab-view#avoid-unnecessary-re-renders
 */

export const PlanMain = () => {
    const { colors } = useTheme();
    const [showAddTaskModal, setShowAddTaskModal] = React.useState(false);
    const [selectedDayKey, setSelectedDayKey] = React.useState<string>(getTodayKey());

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const onDayChanged = (day: number) => {
        const newDayKey = getDayKey(day);
        setSelectedDayKey(newDayKey);
    };

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
                const plannedDay = await PlannedDayController.getForCurrentUserViaApi(
                    selectedDayKey
                );

                if (plannedDay?.plannedDayResults?.length ?? 0 > 0) {
                    const plannedDayResult = plannedDay!.plannedDayResults![0];
                    plannedDayResult.active = true;
                    DailyResultController.updateViaApi(plannedDayResult);
                } else if (plannedDay) {
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
                    leftIcon={'add'}
                    leftRoute={'CreateTask'}
                    leftOnClick={navigateToTomorrowCreateTask}
                    rightIcon={'ellipsis-horizontal'}
                    menuOptions={createEmbtrMenuOptions(menuItems)}
                />

                <Planning
                    showSelectTaskModal={showAddTaskModal}
                    setShowSelectTaskModal={setShowAddTaskModal}
                    dismissSelectTaskModal={() => {
                        setShowAddTaskModal(false);
                    }}
                    openSelectTaskModal={() => {
                        setShowAddTaskModal(true);
                    }}
                    onDayChange={onDayChanged}
                    selectedDayKey={selectedDayKey}
                    useCalendarView={false}
                />
            </View>
        </Screen>
    );
};
