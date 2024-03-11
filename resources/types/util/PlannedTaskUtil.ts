import { PlannedTask } from 'resources/schema';
import { OptimalImageData } from 'src/components/common/images/OptimalImage';

export class PlannedTaskUtil {
    public static getOptimalImage(plannedTask: PlannedTask): OptimalImageData {
        const optimalImage: OptimalImageData = {
            remoteImageUrl: this.getRemoteImageUrl(plannedTask),
            localImage: this.getLocalImage(plannedTask),
        };

        return optimalImage;
    }

    private static getRemoteImageUrl = (plannedTask?: PlannedTask) => {
        return (
            plannedTask?.remoteImageUrl ??
            plannedTask?.scheduledHabit?.remoteImageUrl ??
            plannedTask?.scheduledHabit?.task?.remoteImageUrl
        );
    };

    private static getLocalImage(plannedTask?: PlannedTask) {
        return (
            plannedTask?.localImage ??
            plannedTask?.scheduledHabit?.localImage ??
            plannedTask?.scheduledHabit?.task?.localImage
        );
    }
}
