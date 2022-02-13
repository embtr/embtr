import { Timestamp } from "firebase/firestore";
import RoutineDao from "src/firebase/firestore/planning/RoutineDao";

export interface DaysModel {
    monday: boolean,
    tuesday: boolean,
    wednesday: boolean,
    thursday: boolean,
    friday: boolean,
    saturday: boolean,
    sunday: boolean
}

export interface RoutineModel {
    added: Timestamp,
    name: string,
    startMinute: number,
    duration: number
    days: DaysModel
}

export const createDays = (monday: boolean, tuesday: boolean, wednesday: boolean, thursday: boolean, friday: boolean, saturday: boolean, sunday: boolean) => {
    const days: DaysModel = {
        monday: monday,
        tuesday: tuesday,
        wednesday: wednesday,
        thursday: thursday,
        friday: friday,
        saturday: saturday,
        sunday: sunday
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