import { View } from 'react-native';
import { TodaysTasksWidget } from 'src/components/widgets/TodaysTasksWidget';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';

interface Props {
    plannedDay: PlannedDay;
}

export const TodayTabRoute = ({ plannedDay }: Props) => {
    return (
        <View>
            <View style={{ width: '100%' }}>{<TodaysTasksWidget plannedDay={plannedDay} />}</View>
        </View>
    );
};
