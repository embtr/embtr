import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import React from 'react';
import { RefreshControl, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import PlannedDayController, { clonePlannedTaskModel, getTodayKey, PlannedDay, PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import DailyResultController, { DailyResultModel } from 'src/controller/timeline/daily_result/DailyResultController';
import { wait } from 'src/util/GeneralUtility';
import { Banner } from '../common/Banner';
import { EmbtrMenuCustom } from '../common/menu/EmbtrMenuCustom';
import { createEmbtrMenuOptions, EmbtrMenuOption } from '../common/menu/EmbtrMenuOption';
import { Screen } from '../common/Screen';
import { TodaysCountdownWidget } from '../widgets/TodaysCountdownWidget';
import { TodaysPhotosWidget } from '../widgets/TodaysPhotosWidget';
import { TodaysTasksWidget } from '../widgets/TodaysTasksWidget';
import { StackNavigationProp } from '@react-navigation/stack';
import { TodayTab } from 'src/navigation/RootStackParamList';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';
import UserController, { UserModel } from 'src/controller/user/UserController';
import { QUOTE_OF_THE_DAY_WIDGET, TIME_LEFT_IN_DAY_WIDGET, TODAYS_NOTES_WIDGET, TODAYS_PHOTOS_WIDGET, TODAYS_TASKS_WIDGET } from 'src/util/constants';
import { TodaysNotesWidget } from '../widgets/TodaysNotesWidget';
import { QuoteOfTheDayWidget } from '../widgets/quote_of_the_day/QuoteOfTheDayWidget';

export const Today = () => {
    const [refreshedDate, setRefreshedDate] = React.useState<Date>();
    const [refreshing, setRefreshing] = React.useState(false);
    const [dailyResult, setDailyResult] = React.useState<DailyResultModel>();
    const [plannedDay, setPlannedDay] = React.useState<PlannedDay>();
    const [user, setUser] = React.useState<UserModel>();

    const navigation = useNavigation<StackNavigationProp<TodayTab>>();

    const todayKey = getTodayKey();

    React.useEffect(() => {
        setRefreshedDate(new Date());
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchPlannedDay();
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            fetchUser();
        }, [])
    );
    // may want to just directly call both to guarentee
    // upon refresh that we have all new data
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchPlannedDay();
        wait(500).then(() => {
            setRefreshing(false);
            setRefreshedDate(new Date());
        });
    }, []);

    React.useEffect(() => {
        fetchDailyResult();
    }, [plannedDay]);

    const fetchPlannedDay = () => {
        PlannedDayController.get(getAuth().currentUser!.uid, todayKey, setPlannedDay);
    };

    const fetchDailyResult = async () => {
        if (plannedDay) {
            const foundDailyResult = await DailyResultController.getOrCreate(plannedDay, 'INCOMPLETE');
            setDailyResult(foundDailyResult);
        }
    };

    const fetchUser = async () => {
        const user = await UserController.getCurrentUser();
        setUser(user);
    };

    const togglePlannedTaskStatus = (plannedTask: PlannedTaskModel, currentStatus: string, fastStatusUpdate: Function) => {
        if (!plannedDay) {
            return;
        }

        let newStatus = 'INCOMPLETE';
        if (currentStatus === 'COMPLETE') {
            newStatus = 'FAILED';
        } else if (currentStatus === 'INCOMPLETE') {
            newStatus = 'COMPLETE';
        }

        fastStatusUpdate(newStatus);

        let clonedPlannedTask: PlannedTaskModel = clonePlannedTaskModel(plannedTask);
        clonedPlannedTask.status = newStatus;

        PlannedDayController.updateTask(plannedDay, clonedPlannedTask, () => {
            PlannedDayController.get(getAuth().currentUser!.uid, todayKey, setPlannedDay);
        });
    };

    const closeMenu = useAppSelector(getCloseMenu);
    const menuOptions: EmbtrMenuOption[] = [
        {
            name: 'Widget Marketplace',
            onPress: () => {
                navigation.navigate('WidgetMarketplace');
                closeMenu();
            },
        },
        {
            // this will be used to delete/ reorder widgets
            name: 'Configure',
            onPress: () => {
                closeMenu();
            },
        },
    ];

    if (!user) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    return (
        <Screen>
            <EmbtrMenuCustom />
            <View style={{ height: '100%', width: '100%' }}>
                <Banner name="Today" rightIcon={'ellipsis-horizontal'} menuOptions={createEmbtrMenuOptions(menuOptions)} />
                <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                    <View style={{ height: 7 }} />

                    {/* Today Countdown */}
                    {plannedDay && user.today_widgets?.includes(TIME_LEFT_IN_DAY_WIDGET) && <TodaysCountdownWidget plannedDay={plannedDay} />}

                    {/* QUOTE OF THE DAY WIDGET */}
                    {user.today_widgets?.includes(QUOTE_OF_THE_DAY_WIDGET) && refreshedDate && <QuoteOfTheDayWidget refreshedDate={refreshedDate} />}

                    {/* TODAY'S TASKS WIDGET */}
                    {plannedDay && dailyResult && user.today_widgets?.includes(TODAYS_TASKS_WIDGET) && (
                        <TodaysTasksWidget plannedDay={plannedDay} dailyResult={dailyResult} togglePlannedTask={togglePlannedTaskStatus} />
                    )}

                    {/* TODAY'S NOTES WIDGET */}
                    {user.today_widgets?.includes(TODAYS_NOTES_WIDGET) && <TodaysNotesWidget />}

                    {/* TODAY'S PHOTOS WIDGET */}
                    {plannedDay && dailyResult && user.today_widgets?.includes(TODAYS_PHOTOS_WIDGET) && (
                        <TodaysPhotosWidget plannedDay={plannedDay} dailyResult={dailyResult} onImagesChanged={fetchDailyResult} />
                    )}

                    <View style={{ height: 7 }} />
                </ScrollView>
            </View>
        </Screen>
    );
};
