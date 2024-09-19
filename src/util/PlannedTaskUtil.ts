import { PlannedTask } from 'resources/schema';
import { OptimalImageData } from 'src/components/common/images/OptimalImage';

export namespace PlannedTaskUtil {
    export const getTitle = (plannedTask?: PlannedTask): string => {
        return (
            plannedTask?.title ??
            plannedTask?.scheduledHabit?.title ??
            plannedTask?.scheduledHabit?.task?.title ??
            ''
        );
    };

    export const getDescription = (plannedTask?: PlannedTask): string => {
        return (
            plannedTask?.description ??
            plannedTask?.scheduledHabit?.description ??
            plannedTask?.scheduledHabit?.task?.description ??
            ''
        );
    };

    export const getRemoteImageUrl = (plannedTask?: PlannedTask): string => {
        return (
            plannedTask?.remoteImageUrl ??
            plannedTask?.scheduledHabit?.remoteImageUrl ??
            plannedTask?.scheduledHabit?.task?.remoteImageUrl ??
            ''
        );
    };

    export const getLocalImage = (plannedTask?: PlannedTask): string => {
        return (
            plannedTask?.localImage ??
            plannedTask?.scheduledHabit?.localImage ??
            plannedTask?.scheduledHabit?.task?.localImage ??
            ''
        );
    };

    export const getIcon = (plannedTask?: PlannedTask) => {
        return (
            plannedTask?.icon ??
            plannedTask?.scheduledHabit?.icon ??
            plannedTask?.scheduledHabit?.task?.icon,
            plannedTask?.scheduledHabit?.icon ??
            plannedTask?.scheduledHabit?.task?.icon ??
            plannedTask?.scheduledHabit?.task?.icon,
            plannedTask?.scheduledHabit?.task?.icon ??
            plannedTask?.scheduledHabit?.task?.icon ??
            plannedTask?.scheduledHabit?.task?.icon
        );
    };

    export const getOptimalImage = (plannedTask?: PlannedTask): OptimalImageData => {
        const optimalImage: OptimalImageData = {
            icon: getIcon(plannedTask),
            localImage: getLocalImage(plannedTask),
            remoteImageUrl: getRemoteImageUrl(plannedTask),
        };

        return optimalImage;
    };

    export const getQuantity = (plannedTask?: PlannedTask): number => {
        return plannedTask?.quantity ?? plannedTask?.scheduledHabit?.quantity ?? 1;
    };

    export const getUnit = (plannedTask?: PlannedTask) => {
        return plannedTask?.unit ?? plannedTask?.scheduledHabit?.unit;
    };

    export const isThePlannedTask = (
        plannedTaskA: PlannedTask,
        plannedTaskB: PlannedTask
    ): boolean => {
        if (plannedTaskA.id && plannedTaskB.id && plannedTaskA.id === plannedTaskB.id) {
            return true;
        }

        const plannedTaskAUniqueIdentifier = getUniqueIdentifier(plannedTaskA);
        const plannedTaskBUniqueIdentifier = getUniqueIdentifier(plannedTaskB);
        const isThePlannedTask = plannedTaskAUniqueIdentifier === plannedTaskBUniqueIdentifier;

        return isThePlannedTask;
    };

    export const getUniqueIdentifier = (plannedTask: PlannedTask): string => {
        return `${plannedTask.scheduledHabitId}${plannedTask.timeOfDayId}${plannedTask.originalTimeOfDayId}`;
    };
}
