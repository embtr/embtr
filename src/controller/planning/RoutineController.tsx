import { Timestamp } from "firebase/firestore";
import RoutineDao from "src/firebase/firestore/planning/RoutineDao";
import ProfileDao from "src/firebase/firestore/profile/ProfileDao";

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
    start_minute: number,
    duration: number
    days: DaysModel
}

export const createDays = ({ monday, tuesday, wednesday, thursday, friday, saturday, sunday }: Days) => {
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

export const createRoutineModel = ({ added, name, start_minute, duration, days }: RoutineModel) => {
    const routine: RoutineModel = {
        added: added,
        name: name,
        start_minute: start_minute,
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