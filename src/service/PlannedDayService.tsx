import PlannedDayController from 'src/controller/planning/PlannedDayController';

export namespace PlannedDayService {
    export const isComplete = async (userId: number, dayKey: string) => {
        console.log('isComplete', userId, dayKey)
        const result = PlannedDayController.isComplete(userId, dayKey);
        return result;
    };
}
