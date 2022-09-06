import { View, Text, TextStyle } from 'react-native';
import { ProgressBar } from 'src/components/plan/goals/ProgressBar';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { getDateFromDayKey, PlannedDay } from 'src/controller/planning/PlannedDayController';
import { getDayOfWeek } from 'src/controller/planning/TaskController';
import { DailyResultModel } from 'src/controller/timeline/daily_result/DailyResultController';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { DailyResultCardElement } from './DailyResultCardElement';

interface Props {
    dailyResult: DailyResultModel;
    plannedDay: PlannedDay;
}

export const DailyResultBody = ({ dailyResult, plannedDay }: Props) => {
    const { colors } = useTheme();

    const headerTextStyle = {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: colors.timeline_card_body,
        paddingLeft: TIMELINE_CARD_PADDING,
    } as TextStyle;

    let completedCount = 0;
    plannedDay?.plannedTasks.forEach((plannedTask) => {
        if (plannedTask.status === 'COMPLETE') {
            completedCount += 1;
        }
    });

    const progress = plannedDay ? (completedCount / plannedDay.plannedTasks.length) * 100 : 100;

    const dayOfWeek = getDayOfWeek(getDateFromDayKey(plannedDay?.id ? plannedDay?.id : ''));

    let plannedTaskViews: JSX.Element[] = [];

    plannedDay?.plannedTasks.forEach((plannedTask) => {
        plannedTaskViews.push(
            <View style={{ paddingBottom: 5 }}>
                <DailyResultCardElement plannedTask={plannedTask} />
            </View>
        );
    });

    return (
        <View> 
            <View style={{ paddingTop: 10 }}>
                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: '94%', alignItems: 'center', justifyContent: 'center' }}>
                        <ProgressBar progress={progress} success={dailyResult.data.status !== 'FAILED'} />
                    </View>
                </View>

                <View style={{ paddingTop: 5 }}>
                    <Text style={headerTextStyle}>
                        {dayOfWeek.substring(0, 1).toUpperCase() + dayOfWeek.substring(1)}{' '}
                        <Text style={{ color: plannedDay?.metadata?.status === 'FAILED' ? colors.progress_bar_failed : colors.progress_bar_complete }}>
                            {plannedDay?.metadata?.status === 'FAILED' ? 'Failed!' : 'Compete!'}
                        </Text>
                    </Text>
                </View>

                <View style={{ paddingLeft: TIMELINE_CARD_PADDING, paddingRight: TIMELINE_CARD_PADDING, paddingTop: 5 }}>
                    {/*<Text style={[bodyTextStyle, { textAlign: 'left' }]}>man, I tried really hard on this one! I will get it next time.</Text>
                        <View style={{ paddingTop: 15 }}>{plannedTaskViews}</View>*/}
                    <View>{plannedTaskViews}</View>
                    {/* <Text style={[bodyTextStyle, { color: "gray", fontSize: 12, textAlign: "right", marginTop: 5, marginRight: 10 }]}>{"view more..."}</Text> */}
                </View>
            </View>
        </View>
    );
};
