import { OptimalImageData } from 'src/components/common/images/OptimalImage';
import { ScheduledHabit } from '../../schema';

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

    export const getOptimalImage = (scheduledHabit?: ScheduledHabit): OptimalImageData => {
        const optimalImage: OptimalImageData = {
            remoteImageUrl: getRemoteImageUrl(scheduledHabit),
            localImage: getLocalImage(scheduledHabit),
        };

        return optimalImage;
    };
}
