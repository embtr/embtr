import { RoutineModel } from "src/controller/planning/RoutineController";
import PlannedDayDao from "src/firebase/firestore/planning/PlannedDayDao";

export interface PlannedDay {
    id?: string,
    plannedTasks: PlannedTask[]
}

export interface PlannedTask {
    routineUid: string,
    startMinute?: number,
    duration?: number
    routine?: RoutineModel,
}

class PlannedDayController {
    public static delete(uid: string, callback: Function) {
        PlannedDayDao.delete(uid, callback);
    }

    public static create(plannedDay: PlannedDay) {
        PlannedDayDao.create(plannedDay);
    }
}

export default PlannedDayController;