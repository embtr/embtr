import { getAuth } from 'firebase/auth';
import React from 'react';
import { RefreshControl, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import PlannedDayController, { clonePlannedTaskModel, getTodayKey, PlannedDay, PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import DailyResultController, { DailyResultModel } from 'src/controller/timeline/daily_result/DailyResultController';
import { Banner } from '../common/Banner';
import { Screen } from '../common/Screen';
import { QuoteOfTheDayWidget } from '../widgets/QuoteOfTheDayWidget';
import { TodaysPhotosWidget } from '../widgets/TodaysPhotosWidget';
import { TodaysTasksWidget } from '../widgets/TodaysTasksWidget';

export const Today = () => {
    const [refreshing, setRefreshing] = React.useState(false);
    const [dailyResult, setDailyResult] = React.useState<DailyResultModel>();
    const [plannedDay, setPlannedDay] = React.useState<PlannedDay>();

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        PlannedDayController.get(getAuth().currentUser!.uid, todayKey, setPlannedDay);
        wait(500).then(() => setRefreshing(false));
    }, []);

    const wait = (timeout: number | undefined) => {
        return new Promise((resolve) => setTimeout(resolve, timeout));
    };

    const todayKey = getTodayKey();

    React.useEffect(() => {
        PlannedDayController.get(getAuth().currentUser!.uid, todayKey, setPlannedDay);
    }, []);

    React.useEffect(() => {
        const fetchPlannedDay = async () => {
            if (plannedDay) {
                const foundDailyResult = await DailyResultController.getOrCreate(plannedDay, 'INCOMPLETE');
                setDailyResult(foundDailyResult);
            }
        };

        fetchPlannedDay();
    }, [plannedDay]);

    const togglePlannedTaskStatus = (plannedTask: PlannedTaskModel) => {
        if (!plannedDay) {
            return;
        }

        let newStatus = 'INCOMPLETE';
        if (plannedTask.status === 'COMPLETE') {
            newStatus = 'FAILED';
        } else if (plannedTask.status === 'INCOMPLETE') {
            newStatus = 'COMPLETE';
        }

        let clonedPlannedTask: PlannedTaskModel = clonePlannedTaskModel(plannedTask);
        clonedPlannedTask.status = newStatus;

        PlannedDayController.updateTask(plannedDay, clonedPlannedTask, () => {
            PlannedDayController.get(getAuth().currentUser!.uid, todayKey, setPlannedDay);
        });
    };

    return (
        <Screen>
            <View style={{ height: '100%', width: '100%' }}>
                <Banner name="Today" />
                <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                    <View style={{ height: 7 }} />
                    {/* QUOTE OF THE DAY WIDGET */}
                    <QuoteOfTheDayWidget />

                    {/* TODAY'S TASKS WIDGET */}
                    {plannedDay && dailyResult && (
                        <TodaysTasksWidget plannedDay={plannedDay} dailyResult={dailyResult} togglePlannedTask={togglePlannedTaskStatus} />
                    )}

                    {/* TODAY'S PHOTOS WIDGET */}
                    {plannedDay && dailyResult && <TodaysPhotosWidget plannedDay={plannedDay} dailyResult={dailyResult} />}
                </ScrollView>
            </View>
        </Screen>
    );
};
