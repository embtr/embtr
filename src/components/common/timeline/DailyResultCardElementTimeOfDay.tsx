import { View } from 'react-native';
import { PlannedTask } from 'resources/schema';
import { Constants } from 'resources/types/constants/constants';
import { ProgressSvg } from 'src/components/plan/task/progress/ProgressSvg';
import { OptimalImage, OptimalImageData } from '../images/OptimalImage';
import { TimeOfDayUtility } from 'src/util/time_of_day/TimeOfDayUtility';

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

    const size = 20;

    return (
        <View>
            <ProgressSvg
                size={size}
                strokeWidth={1}
                targetQuantity={quantity ?? 1}
                completedQuantity={completedQuantity ?? 0}
                isSkipped={plannedTask.status === Constants.HabitStatus.SKIPPED}
                isFailed={plannedTask.status === Constants.HabitStatus.FAILED}
            />

            <View
                style={{
                    position: 'absolute',
                    zIndex: -1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: size,
                    height: size,
                }}
            >
                <OptimalImage data={imageData} style={{ height: size, width: size }} />
            </View>
        </View>
    );
};
