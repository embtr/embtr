import PlannedDayController, {
    getDayKeyFromDate,
} from 'src/controller/planning/PlannedDayController';

export namespace PlannedDayService {
    export const isComplete = async (userId: number, dayKey: string) => {
        const result = await PlannedDayController.isComplete(userId, dayKey);
        return result === true;
    };

    export const getTodayDayKey = () => {
        const date = new Date();
        const dayKey = getDayKeyFromDate(date);

        return dayKey;
    };
}
