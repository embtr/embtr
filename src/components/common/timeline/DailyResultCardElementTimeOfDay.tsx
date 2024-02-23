import { View } from 'react-native';
import { PlannedTask } from 'resources/schema';
import { Constants } from 'resources/types/constants/constants';
import { ProgressSvg } from 'src/components/plan/task/progress/ProgressSvg';
import { OptimalImage, OptimalImageData } from '../images/OptimalImage';
import { TimeOfDayUtility } from 'src/util/time_of_day/TimeOfDayUtility';
import { PADDING_LARGE, PADDING_SMALL } from 'src/util/constants';

interface Props {
    plannedTask: PlannedTask;
}

export const DailyResultCardElementTimeOfDay = ({ plannedTask }: Props) => {
    const imageData: OptimalImageData = {
        localImage: TimeOfDayUtility.getTimeOfDayImageRepoKey(plannedTask.timeOfDayId ?? 0),
    };

    const quantity = plannedTask.quantity;
    const completedQuantity = plannedTask.completedQuantity;

    let taskIsComplete = false;
    if (quantity && completedQuantity) {
        taskIsComplete = completedQuantity >= quantity;
    }

    let status = plannedTask.status;
    if (status === undefined) {
        status = Constants.HabitStatus.INCOMPLETE;
    }

    let stats = `${completedQuantity} / ${quantity}`;
    if (taskIsComplete) {
        stats = `${completedQuantity}`;
    }

    const size = 16;

    return (
        <View>
            <ProgressSvg
                size={size}
                strokeWidth={2.5}
                incompleteIsFailed={true}
                targetQuantity={quantity ?? 1}
                completedQuantity={completedQuantity ?? 0}
                isSkipped={plannedTask.status === Constants.HabitStatus.SKIPPED}
                isFailed={plannedTask.status === Constants.HabitStatus.FAILED}
            />
        </View>
    );
};
