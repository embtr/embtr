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
    duration: number,
    days: DaysModel,
    active?: boolean
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

export const getTomorrowDayOfWeek = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayNumber = new Date().getDay();
    const tomorrowNumber = dayNumber < 6 ? dayNumber + 1 : 0;
    const tomorrow = days[tomorrowNumber];

    return tomorrow;
};

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
    public static createRoutine(routine: RoutineModel, callback: Function) {
        const result = RoutineDao.createRoutine(routine);
        result.then(document => {
            callback();
        });
    }

    public static archiveRoutine(routine: RoutineModel, callback: Function) {
        const result = RoutineDao.deleteRoutine(routine);
        result.then(document => {
        callback();
        });
    }

    static getRoutine(uid: string, id: string, callback: Function) {
        const result = RoutineDao.getRoutine(uid, id);
        result.then(document => {
            let routine: RoutineModel = document.data() as RoutineModel;
            routine.id = document.id;
            callback(routine);
        }).catch(() => {
            callback(undefined);
        });
    }

    static getRoutines(uid: string, callback: Function) {
        const result = RoutineDao.getRoutines(uid);

        let routines: RoutineModel[] = [];
        result.then(documents => {
            documents.docs.forEach(document => {
                let routine: RoutineModel = document.data() as RoutineModel;

                if (routine.active === false) {
                    return;
                }

                routine.id = document.id;
                routines.push(routine);
            });
        }).then(() => {
            callback(routines);
        }).catch(() => {
            callback([]);
        });
    }

    static getRoutinesForDay(uid: string, day: string, callback: Function) {
        let routinesForDay: RoutineModel[] = [];

        this.getRoutines(uid, (routines: RoutineModel[]) => {
            routines.forEach(routine => {
                Object.entries(routine.days).forEach(dayModel => {
                    if (dayModel[0] === day && dayModel[1]) {
                        routinesForDay.push(routine);
                    }
                });
            });

            callback(routinesForDay);
        });
    }
}

export default RoutineController;