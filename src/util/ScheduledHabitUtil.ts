import { ScheduledHabit } from 'resources/schema';
import { OptimalImageData } from 'src/components/common/images/OptimalImage';

export namespace ScheduledHabitUtil {
    export const getTitle = (scheduledHabit?: ScheduledHabit): string => {
        return scheduledHabit?.title ?? scheduledHabit?.task?.title ?? '';
    };

    export const getDescription = (scheduledHabit?: ScheduledHabit): string => {
        return scheduledHabit?.description ?? scheduledHabit?.task?.description ?? '';
    };

    export const getRemoteImageUrl = (scheduledHabit?: ScheduledHabit): string => {
        return scheduledHabit?.remoteImageUrl ?? scheduledHabit?.task?.remoteImageUrl ?? '';
    };

    export const getLocalImage = (scheduledHabit?: ScheduledHabit): string => {
        return scheduledHabit?.localImage ?? scheduledHabit?.task?.localImage ?? '';
    };

    export const getIcon = (scheduledHabit?: ScheduledHabit) => {
        return scheduledHabit?.icon ?? scheduledHabit?.task?.icon;
    };

    export const getOptimalImage = (scheduledHabit?: ScheduledHabit): OptimalImageData => {
        const optimalImage: OptimalImageData = {
            localImage: getLocalImage(scheduledHabit),
            remoteImageUrl: getRemoteImageUrl(scheduledHabit),
        };

        return optimalImage;
    };
}
