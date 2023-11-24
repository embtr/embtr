import { View } from 'react-native';
import { DayPicker } from 'src/components/plan/planning/DayPicker';
import { PlanDay } from './PlanDay';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';

export const Planning = () => {
    const onSharePlannedDayResults = async () => {
        // if (selectedPlannedDay) {
        //     await PlanningService.sharePlannedDayResults(selectedPlannedDay!);
        // }
        // refreshPlannedToday();
    };

    return (
        <View>
            <View style={{ flex: 1 }}>
                <View style={{ paddingBottom: TIMELINE_CARD_PADDING }}>
                    <DayPicker />
                </View>

            </View>
        </View>
    );
};
