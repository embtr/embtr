import { View } from 'react-native';
import { PlannedTask } from 'resources/schema';
import { Constants } from 'resources/types/constants/constants';
import { CompleteResultIcon } from 'src/components/common/timeline/result_icons/CompleteResultIcon';
import { FailedResultIcon } from 'src/components/common/timeline/result_icons/FailedResultIcon';
import { IncompleteResultIcon } from 'src/components/common/timeline/result_icons/IncompleteResultIcon';
import { SkippedResultIcon } from 'src/components/common/timeline/result_icons/SkippedResultIcon';

interface Props {
    plannedTask: PlannedTask;
}

export const PlannedDayResultCardElementTimeOfDay = ({ plannedTask }: Props) => {
    const quantity = plannedTask.quantity;
    const completedQuantity = plannedTask.completedQuantity;

    const taskIsComplete =
        plannedTask.status === Constants.CompletionState.COMPLETE ||
        (completedQuantity ?? 0) >= (quantity ?? 1);
    const taskIsSkipped = plannedTask.status === Constants.CompletionState.SKIPPED;
    const taskIsFailed = plannedTask.status === Constants.CompletionState.FAILED;

    let status = plannedTask.status;
    if (status === undefined) {
        status = Constants.CompletionState.INCOMPLETE;
    }

    let stats = `${completedQuantity} / ${quantity}`;
    if (taskIsComplete) {
        stats = `${completedQuantity}`;
    }

    return (
        <View>
            {taskIsSkipped ? (
                <SkippedResultIcon />
            ) : taskIsFailed ? (
                <FailedResultIcon />
            ) : taskIsComplete ? (
                <CompleteResultIcon />
            ) : (
                <IncompleteResultIcon />
            )}
        </View>
    );
};
