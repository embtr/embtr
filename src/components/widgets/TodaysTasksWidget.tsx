import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text, View } from 'react-native';
import { MainTabScreens } from 'src/navigation/RootStackParamList';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu, getTodaysPlannedDay, setTodaysPlannedDay } from 'src/redux/user/GlobalState';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { EmbtrMenuOption } from '../common/menu/EmbtrMenuOption';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';
import { PlannedDay, User } from 'resources/schema';
import React from 'react';
import PlannedDayController, { getTodayKey } from 'src/controller/planning/PlannedDayController';
import { PlanDay } from '../plan/planning/PlanDay';
import { PlanningService } from 'src/util/planning/PlanningService';
import { getCurrentUid } from 'src/session/CurrentUserProvider';

export enum WidgetSource {
    TODAY,
    PROFILE,
}

interface Props {
    user: User;
    source: WidgetSource;
}

export const TodaysActivitiesWidget = ({ user, source }: Props) => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<MainTabScreens>>();

    const [guestPlannedDay, setGuestPlannedDay] = React.useState<PlannedDay | undefined>(undefined);

    const isCurrentUser = user.uid === getCurrentUid();

    const dispatch = useAppDispatch();
    const todaysPlannedDay = isCurrentUser ? useAppSelector(getTodaysPlannedDay) : guestPlannedDay;
    const closeMenu = useAppSelector(getCloseMenu);

    const updateTodaysPlannedDay = (plannedDay: PlannedDay) => {
        if (isCurrentUser) {
            dispatch(setTodaysPlannedDay(plannedDay));
        } else {
            setGuestPlannedDay(plannedDay);
        }
    };

    const fetch = async () => {
        if (!user.id) {
            return;
        }

        const todayKey = getTodayKey();
        const plannedDay = await PlannedDayController.getViaApi(user.id, todayKey);
        if (plannedDay) {
            updateTodaysPlannedDay(plannedDay);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetch();
        }, [])
    );

    const onSharePlannedDayResults = async () => {
        if (todaysPlannedDay) {
            await PlanningService.sharePlannedDayResults(todaysPlannedDay);
        }

        fetch();
    };

    let menuOptions: EmbtrMenuOption[] = [];
    menuOptions.push({
        name: 'Edit',
        onPress: () => {
            navigation.navigate('PlanTab', { screen: 'PlanMain' });
            closeMenu();
        },
    });

    return (
        <WidgetBase
            menuOptions={isCurrentUser ? menuOptions : undefined}
            symbol={isCurrentUser ? 'add-outline' : undefined}
            onPressSymbol={isCurrentUser ? () => {} : undefined}
        >
            <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>
                Today's Activities
            </Text>

            {todaysPlannedDay ? (
                <PlanDay
                    plannedDay={todaysPlannedDay}
                    onPlannedDayUpdated={updateTodaysPlannedDay}
                    navigateToAddTasks={() => {}}
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
