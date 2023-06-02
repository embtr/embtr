import { Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import React from 'react';
import { PlannedDay } from 'resources/schema';
import PlannedDayController, {
    getTodayKey,
    getDayKey,
} from 'src/controller/planning/PlannedDayController';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';
import { PlanningService } from 'src/util/planning/PlanningService';
import { EmbtrMenuOption, createEmbtrMenuOptions } from '../common/menu/EmbtrMenuOption';
import { Planning } from '../plan/planning/Planning';

export const PlanningWidget = () => {
    const { colors } = useTheme();

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
        <WidgetBase
            menuOptions={[]}
            symbol="add-outline"
            onPressSymbol={() => {
                setShowAddTaskModal(true);
            }}
        >
            <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>
                    Planning
                </Text>

                <View style={{ paddingTop: 5 }}>
                    <Planning
                        showSelectTaskModal={showAddTaskModal}
                        setShowSelectTaskModal={setShowAddTaskModal}
                        dismissSelectTaskModal={() => {
                            setShowAddTaskModal(false);
                        }}
                        onDayChange={onDayChanged}
                        selectedDayKey={selectedDayKey}
                        useCalendarView={false}
                    />
                </View>
            </View>
        </WidgetBase>
    );
};
