import { Text, View } from 'react-native';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';
import { DailyResultModel } from 'src/controller/timeline/daily_result/DailyResultController';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { DailyResultCardElement } from '../common/timeline/DailyResultCardElement';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';

interface Props {
    dailyResult: DailyResultModel;
    plannedDay: PlannedDay;
    togglePlannedTask: Function;
}

export const TodaysTasksWidget = ({ dailyResult, plannedDay, togglePlannedTask }: Props) => {
    const { colors } = useTheme();

    let plannedTaskViews: JSX.Element[] = [];
    plannedDay?.plannedTasks.forEach((plannedTask) => {
        plannedTaskViews.push(
            <View key={plannedTask.id} style={{ paddingBottom: 5 }}>
                <DailyResultCardElement plannedTask={plannedTask} onPress={togglePlannedTask} />
            </View>
        );
    });

    return (
        <WidgetBase>
            <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>Today's Tasks</Text>
            <View style={{ paddingLeft: 10, paddingTop: 15 }}>{plannedTaskViews}</View>
        </WidgetBase>
    );
};
