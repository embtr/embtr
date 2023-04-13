import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text, View } from 'react-native';
import { MainTabScreens } from 'src/navigation/RootStackParamList';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { EmbtrMenuOption } from '../common/menu/EmbtrMenuOption';
import { DailyResultCardElement } from '../common/timeline/DailyResultCardElement';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';
import { PlannedDay, User } from 'resources/schema';
import React from 'react';
import PlannedDayController, { getTodayKey } from 'src/controller/planning/PlannedDayController';

interface Props {
    user: User;
}

export const TodaysTasksWidget = ({ user }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<MainTabScreens>>();
    const closeMenu = useAppSelector(getCloseMenu);

    const [plannedDay, setPlannedDay] = React.useState<PlannedDay>();

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

    let plannedTaskViews: JSX.Element[] = [];
    plannedDay?.plannedTasks?.forEach((plannedTask) => {
        plannedTaskViews.push(
            <View key={plannedTask.id} style={{ paddingBottom: 5 }}>
                <DailyResultCardElement plannedTask={plannedTask} onPress={() => {}} />
            </View>
        );
    });

    let menuOptions: EmbtrMenuOption[] = [];
    menuOptions.push({
        name: 'Edit',
        onPress: () => {
            navigation.navigate('PlanTab', { screen: 'PlanMain' });
            closeMenu();
        },
    });

    const isGuest = true;

    return (
        <WidgetBase menuOptions={!isGuest ? menuOptions : undefined}>
            <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>Today's Tasks</Text>
            {plannedTaskViews.length > 0 && <View style={{ paddingLeft: 10, paddingTop: 15 }}>{plannedTaskViews}</View>}
            {plannedTaskViews.length === 0 && (
                <View style={{ paddingTop: 5 }}>
                    {isGuest ? (
                        <Text style={{ color: colors.text }}>
                            It appears that today is a <Text style={{ color: colors.tab_selected }}>rest day</Text>.
                        </Text>
                    ) : (
                        <Text style={{ color: colors.text }}>
                            you have an empty plate -{' '}
                            <Text
                                onPress={() => {
                                    if (plannedDay?.id) {
                                        navigation.navigate('PlanTab', { screen: 'PlanMain' });
                                    }
                                }}
                                style={{ color: colors.tab_selected, fontFamily: 'Poppins_400Regular' }}
                            >
                                plan your day
                            </Text>
                        </Text>
                    )}
                </View>
            )}
        </WidgetBase>
    );
};
