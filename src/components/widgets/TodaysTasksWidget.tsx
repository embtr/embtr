import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text, View } from 'react-native';
import { MainTabScreens } from 'src/navigation/RootStackParamList';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu, getFireConfetti } from 'src/redux/user/GlobalState';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { EmbtrMenuOption } from '../common/menu/EmbtrMenuOption';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';
import { PlannedDay, User } from 'resources/schema';
import React from 'react';
import PlannedDayController, { getTodayKey } from 'src/controller/planning/PlannedDayController';
import { PlanDay } from '../plan/planning/PlanDay';
import { PlanningService } from 'src/util/planning/PlanningService';
import { AddHabitModal } from '../plan/planning/AddHabitModal';

export enum WidgetSource {
    TODAY,
    PROFILE,
}

interface Props {
    user: User;
    source: WidgetSource;
}

export const TodaysTasksWidget = ({ user, source }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<MainTabScreens>>();
    const closeMenu = useAppSelector(getCloseMenu);
    const fireConfetti = useAppSelector(getFireConfetti);

    const [plannedDay, setPlannedDay] = React.useState<PlannedDay>();
    const [showAddTaskModal, setShowSelectTaskModal] = React.useState(false);

    const fetch = async () => {
        if (!user.id) {
            return;
        }

        const todayKey = getTodayKey();
        const plannedDay = await PlannedDayController.getViaApi(user.id, todayKey);
        setPlannedDay(plannedDay);
    };

    useFocusEffect(
        React.useCallback(() => {
            fetch();
        }, [])
    );

    const onSharePlannedDayResults = async () => {
        if (plannedDay) {
            await PlanningService.sharePlannedDayResults(plannedDay!);
        }

        fetch();
    };

    const onTaskUpdated = async () => {
        if (!plannedDay) {
            return;
        }

        const result = await PlanningService.onTaskUpdated(plannedDay, fireConfetti);

        setPlannedDay(result);
    };

    let menuOptions: EmbtrMenuOption[] = [];
    menuOptions.push({
        name: 'Edit',
        onPress: () => {
            navigation.navigate('PlanTab', { screen: 'PlanMain' });
            closeMenu();
        },
    });

    console.log(plannedDay);

    return (
        <WidgetBase
            menuOptions={menuOptions}
            symbol="add-outline"
            onPressSymbol={() => {
                setShowSelectTaskModal(true);
            }}
        >
            {plannedDay?.id && (
                <AddHabitModal
                    visible={showAddTaskModal}
                    plannedDay={plannedDay}
                    dismiss={() => {
                        fetch();
                        setShowSelectTaskModal(false);
                    }}
                />
            )}

            <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>
                Today's Activities
            </Text>
            {plannedDay ? (
                <PlanDay
                    plannedDay={plannedDay}
                    onTaskUpdated={onTaskUpdated}
                    setShowSelectTaskModal={setShowSelectTaskModal}
                    onSharePlannedDayResults={onSharePlannedDayResults}
                    showCreatePlannedDayResultsRecommendation={source !== WidgetSource.PROFILE}
                />
            ) : (
                <View style={{ paddingTop: 10, flexDirection: 'row' }}>
                    <Text style={{ color: colors.text }}>It looks like today is a </Text>
                    <Text style={{ color: colors.tab_selected }}>rest day.</Text>
                </View>
            )}
        </WidgetBase>
    );
};
