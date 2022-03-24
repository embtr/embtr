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
    id?: string,
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

export const taskRunsOnSelectedDay = (routine: RoutineModel, selectedDaysOfWeek: DaysModel): boolean => {
    return (routine.days.monday && selectedDaysOfWeek.monday) || (routine.days.tuesday && selectedDaysOfWeek.tuesday) || (routine.days.wednesday && selectedDaysOfWeek.wednesday) || (routine.days.thursday && selectedDaysOfWeek.thursday) || (routine.days.friday && selectedDaysOfWeek.friday) || (routine.days.saturday && selectedDaysOfWeek.saturday) || (routine.days.sunday && selectedDaysOfWeek.sunday);
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

export const startMinuteToString = (startMinute: number) => {
    const hours = Math.floor(startMinute / 60);
    const minutes = startMinute % 60;
    
    const hoursString = "" + (hours <= 12 ? hours : hours - 12);
    const minutesString = (minutes < 10 ? "0" : "") + minutes;
    const AMPMString = hours <= 12 ? "AM" : "PM";

    return "" + hoursString + ":" + minutesString + " " + AMPMString;
}

export const durationToString = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    if (hours === 0) {
        return minutes + " minutes"
    }

    return hours + " hours and " + minutes + " minutes";
};

class RoutineController {
    public static createRoutine(routineModel: RoutineModel, callback: Function) {
        const result = RoutineDao.createRoutine(routineModel);
        result.then(document => {
            callback();
        });
    }

    static getRoutines(uid: string, callback: Function) {
        const result = RoutineDao.getRoutines(uid);

        let routines: RoutineModel[] = [];
        result.then(documents => {
            documents.docs.forEach(document => {
                let routine: RoutineModel = document.data() as RoutineModel;
                routine.id = document.id;
                routines.push(routine);
            });
        }).then(() => {
            callback(routines);
        }).catch(() => {
            callback([]);
        });
    }
}

export default RoutineController;