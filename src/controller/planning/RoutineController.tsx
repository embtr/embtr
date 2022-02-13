import { Timestamp } from "firebase/firestore";
import RoutineDao from "src/firebase/firestore/planning/RoutineDao";

export interface DaysModel {
    sunday: boolean,
    monday: boolean,
    tuesday: boolean,
    wednesday: boolean,
    thursday: boolean,
    friday: boolean,
    saturday: boolean
}

export interface RoutineModel {
    added: Timestamp,
    name: string,
    startMinute: number,
    duration: number
    days: DaysModel
}

export const createDays = (sunday: boolean, monday: boolean, tuesday: boolean, wednesday: boolean, thursday: boolean, friday: boolean, saturday: boolean) => {
    const days: DaysModel = {
        sunday: sunday,
        monday: monday,
        tuesday: tuesday,
        wednesday: wednesday,
        thursday: thursday,
        friday: friday,
        saturday: saturday
    };

    return days;
}

export const createRoutineModel = (name: string, startMinute: number, duration: number, days: DaysModel) => {
    const routine: RoutineModel = {
        added: Timestamp.now(),
        name: name,
        startMinute: startMinute,
        duration: duration,
        days: days
    }

    return routine;
};

class RoutineController {
    public static createRoutine(routineModel: RoutineModel, callback: Function) {
        const result = RoutineDao.createRoutine(routineModel);
        result.then(document => {
            callback();
        });
    }
}

export default RoutineController;