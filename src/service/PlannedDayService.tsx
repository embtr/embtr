import PlannedDayController, {
    getDayKeyFromDate,
} from 'src/controller/planning/PlannedDayController';

export namespace PlannedDayService {
    export const isComplete = async (userId: number, dayKey: string) => {
        console.log('isComplete', userId, dayKey)
        const result = PlannedDayController.isComplete(userId, dayKey);
        return result;
    };

    export const getTodayDayKey = () => {
        const date = new Date();
        const dayKey = getDayKeyFromDate(date);

        return dayKey;
    };
}
