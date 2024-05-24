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
}
