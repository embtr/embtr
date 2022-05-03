import { Timestamp } from "firebase/firestore";
import TaskDao from "src/firebase/firestore/planning/TaskDao";

export interface DaysModel {
    sunday: boolean,
    monday: boolean,
    tuesday: boolean,
    wednesday: boolean,
    thursday: boolean,
    friday: boolean,
    saturday: boolean
}

export interface TaskModel {
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

export const taskRunsOnSelectedDay = (task: TaskModel, selectedDaysOfWeek: DaysModel): boolean => {
    return (task.days.monday && selectedDaysOfWeek.monday) || (task.days.tuesday && selectedDaysOfWeek.tuesday) || (task.days.wednesday && selectedDaysOfWeek.wednesday) || (task.days.thursday && selectedDaysOfWeek.thursday) || (task.days.friday && selectedDaysOfWeek.friday) || (task.days.saturday && selectedDaysOfWeek.saturday) || (task.days.sunday && selectedDaysOfWeek.sunday);
}

export const getTomorrowDayOfWeek = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayNumber = new Date().getDay();
    const tomorrowNumber = dayNumber < 6 ? dayNumber + 1 : 0;
    const tomorrow = days[tomorrowNumber];

    return tomorrow;
};

export const createTaskModel = (name: string, startMinute: number, duration: number, days: DaysModel) => {
    const task: TaskModel = {
        added: Timestamp.now(),
        name: name,
        startMinute: startMinute,
        duration: duration,
        days: days
    }

    return task;
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

    let minutesString: string = minutes.toString();
    if (minutesString.length == 1) {
        minutesString = "0" + minutesString;
    }

    let value = "";
    if (hours > 0) {
        value += hours + ":";
    }
    value += minutesString + ":";
    value += "00";

    return value;
};

class TaskController {
    public static createTask(task: TaskModel, callback: Function) {
        const result = TaskDao.createTask(task);
        result.then(document => {
            callback();
        });
    }

    public static archiveTask(task: TaskModel, callback: Function) {
        const result = TaskDao.archiveTask(task);
        result.then(document => {
        callback();
        });
    }

    static getTask(uid: string, id: string, callback: Function) {
        const result = TaskDao.getTask(uid, id);
        result.then(document => {
            let task: TaskModel = document.data() as TaskModel;
            task.id = document.id;
            callback(task);
        }).catch(() => {
            callback(undefined);
        });
    }

    static getTasks(uid: string, callback: Function) {
        const result = TaskDao.getTasks(uid);

        let tasks: TaskModel[] = [];
        result.then(documents => {
            documents.docs.forEach(document => {
                let task: TaskModel = document.data() as TaskModel;

                if (task.active === false) {
                    return;
                }

                task.id = document.id;
                tasks.push(task);
            });
        }).then(() => {
            callback(tasks);
        }).catch(() => {
            callback([]);
        });
    }

    static getTasksForDay(uid: string, day: string, callback: Function) {
        let tasksForDay: TaskModel[] = [];

        this.getTasks(uid, (tasks: TaskModel[]) => {
            tasks.forEach(task => {
                Object.entries(task.days).forEach(dayModel => {
                    if (dayModel[0] === day && dayModel[1]) {
                        tasksForDay.push(task);
                    }
                });
            });

            callback(tasksForDay);
        });
    }
}

export default TaskController;