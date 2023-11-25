import { View } from 'react-native';
import { DayPicker } from 'src/components/plan/planning/DayPicker';
import { PlanDay } from './PlanDay';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { UpdatePlannedTaskModal } from '../UpdatePlannedTaskModal';

export const Planning = () => {
    const onSharePlannedDayResults = async () => {
        // if (selectedPlannedDay) {
        //     await PlanningService.sharePlannedDayResults(selectedPlannedDay!);
        // }
        // refreshPlannedToday();
    };

    return (
        <View>
            <UpdatePlannedTaskModal />

            <View>
                <View style={{ paddingBottom: TIMELINE_CARD_PADDING }}>
                    <DayPicker />
                </View>

                <PlanDay onSharePlannedDayResults={() => {}} />
            </View>
        </View>
    );
};
