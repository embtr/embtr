import { getAuth } from 'firebase/auth';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import PlannedDayController, { getTodayKey, PlannedDay } from 'src/controller/planning/PlannedDayController';
import { POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { useTheme } from '../theme/ThemeProvider';

export const TodaysTasksWidget = () => {
    const { colors } = useTheme();

    const [today, setToday] = React.useState<PlannedDay>();

    const todayKey = getTodayKey();

    React.useEffect(() => {
        PlannedDayController.get(getAuth().currentUser!.uid, todayKey, setToday);
    }, []);

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
                    <Text style={{ color: colors.text, fontFamily: POPPINS_REGULAR, paddingTop: 5 }}></Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};
