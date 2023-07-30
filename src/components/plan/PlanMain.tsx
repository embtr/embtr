import React from 'react';
import { View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { Planning } from './planning/Planning';
import { EmbtrMenuOption, createEmbtrMenuOptions } from '../common/menu/EmbtrMenuOption';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';
import PlannedDayController, {
    getDayKey,
    getTodayKey,
} from 'src/controller/planning/PlannedDayController';
import { PlannedDay } from 'resources/schema';
import { PlanningService } from 'src/util/planning/PlanningService';

/*
 * Avoid rerenders
 * https://github.com/satya164/react-native-tab-view#avoid-unnecessary-re-renders
 */

export const PlanMain = () => {
    const [showAddTaskModal, setShowAddTaskModal] = React.useState(false);
    const [plannedDay, setPlannedDay] = React.useState<PlannedDay>();
    const [selectedDayKey, setSelectedDayKey] = React.useState<string>(getTodayKey());
    const [refreshTimestamp, setRefreshTimestamp] = React.useState(new Date());

    const fetchPlannedDay = async () => {
        const plannedDay = await PlannedDayController.getForCurrentUserViaApi(selectedDayKey);
        setPlannedDay(plannedDay);
    };

    React.useEffect(() => {
        fetchPlannedDay();
    }, [selectedDayKey]);

    const onDayChanged = (day: number) => {
        const newDayKey = getDayKey(day);
        setSelectedDayKey(newDayKey);
    };

    const navigateToTomorrowCreateTask = () => {
        setShowAddTaskModal(true);
    };

    const closeMenu = useAppSelector(getCloseMenu);
    const menuItems: EmbtrMenuOption[] = [
        {
            name: 'Share Results',
            onPress: async () => {
                if (plannedDay) {
                    PlanningService.sharePlannedDayResults(plannedDay!);
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

                <Planning />
            </View>
        </Screen>
    );
};
