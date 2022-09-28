import { getAuth } from 'firebase/auth';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import PlannedDayController, { getTodayKey, PlannedDay } from 'src/controller/planning/PlannedDayController';
import DailyResultController, { DailyResultModel } from 'src/controller/timeline/daily_result/DailyResultController';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { DailyResultBody } from '../common/timeline/DailyResultBody';
import { useTheme } from '../theme/ThemeProvider';

export const TodaysTasksWidget = () => {
    const { colors } = useTheme();

    const [dailyResult, setDailyResult] = React.useState<DailyResultModel>();
    const [plannedDay, setPlannedDay] = React.useState<PlannedDay>();

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

    return (
        <TouchableWithoutFeedback>
            <View style={{ paddingLeft: 5, paddingRight: 5, paddingTop: 5 }}>
                <View
                    style={{
                        borderRadius: 15,
                        backgroundColor: colors.timeline_card_background,
                        paddingTop: 10,
                        paddingBottom: 10,
                        paddingLeft: 10,
                        paddingRight: 5,
                    }}
                >
                    <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>Today's Tasks</Text>

                    <View style={{ paddingLeft: 10 }}>
                        {plannedDay && dailyResult && <DailyResultBody dailyResult={dailyResult} plannedDay={plannedDay} />}
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};
