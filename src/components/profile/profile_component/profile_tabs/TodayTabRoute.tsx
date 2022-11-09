import { View } from 'react-native';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';
import { TodaysTasksWidget } from 'src/components/widgets/TodaysTasksWidget';

interface Props {
    plannedDay: PlannedDay;
}

export const TodayTabRoute = ({ plannedDay }: Props) => {
    return (
        <View>
            <View style={{ width: '100%' }}>{plannedDay && <TodaysTasksWidget plannedDay={plannedDay} />}</View>
        </View>
    );
};
