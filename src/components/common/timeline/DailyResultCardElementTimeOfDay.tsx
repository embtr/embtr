import { View } from 'react-native';
import { PlannedTask } from 'resources/schema';
import { Constants } from 'resources/types/constants/constants';
import { ProgressSvg } from 'src/components/plan/task/progress/ProgressSvg';
import { SkippedResultIcon } from './result_icons/SkippedResultIcon';
import { FailedResultIcon } from './result_icons/FailedResultIcon';
import { CompleteResultIcon } from './result_icons/CompleteResultIcon';
import { IncompleteResultIcon } from './result_icons/IncompleteResultIcon';

interface Props {
    plannedTask: PlannedTask;
}

export const DailyResultCardElementTimeOfDay = ({ plannedTask }: Props) => {
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

    const size = 16;

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
