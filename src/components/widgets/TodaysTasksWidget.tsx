import { Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';
import { DailyResultModel } from 'src/controller/timeline/daily_result/DailyResultController';
import { CARD_SHADOW, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { DailyResultBody } from '../common/timeline/DailyResultBody';
import { DailyResultCardElement } from '../common/timeline/DailyResultCardElement';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
    dailyResult: DailyResultModel;
    plannedDay: PlannedDay;
}

export const TodaysTasksWidget = ({ dailyResult, plannedDay }: Props) => {
    const { colors } = useTheme();

    let plannedTaskViews: JSX.Element[] = [];

    plannedDay?.plannedTasks.forEach((plannedTask) => {
        plannedTaskViews.push(
            <View key={plannedTask.id} style={{ paddingBottom: 5 }}>
                <DailyResultCardElement plannedTask={plannedTask} />
            </View>
        );
    });

    return (
        <TouchableWithoutFeedback>
            <View style={{ paddingLeft: 5, paddingRight: 5, paddingTop: 5 }}>
                <View
                    style={[
                        {
                            borderRadius: 15,
                            backgroundColor: colors.timeline_card_background,
                            paddingTop: 10,
                            paddingBottom: 10,
                            paddingLeft: 10,
                            paddingRight: 5,
                        },
                        CARD_SHADOW,
                    ]}
                >
                    <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>Today's Tasks</Text>
                    <View style={{ paddingLeft: 10, paddingTop: 15 }}>{plannedTaskViews}</View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};
