import { Timestamp } from "firebase/firestore";
import TaskDao from "src/firebase/firestore/planning/TaskDao";
import { getDateFromDayKey } from "./PlannedDayController";

export interface TaskModel {
    id?: string,
    added: Timestamp,
    name: string,
    description: string,
    goalId: string,
    active?: boolean
}

export const getDayOfWeekFromDayKey = (dayKey: string) => {
    const date = getDateFromDayKey(dayKey);
    const dayOfWeek = getDayOfWeek(date);
    return dayOfWeek;
};

export const getDayOfWeek = (date: Date) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    const dayNumber = date.getDay();
    const tomorrowNumber = dayNumber < 6 ? dayNumber + 1 : 0;
    const tomorrow = days[tomorrowNumber];

    return tomorrow;
}

export const createTaskModel = (name: string, description: string, goalId: string) => {
    const task: TaskModel = {
        added: Timestamp.now(),
        name: name,
        description: description,
        goalId: goalId
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
            tasks.sort((a, b) => (a.name > b.name) ? 1 : -1).reverse();
            callback(tasks);
        }).catch(() => {
            callback([]);
        });
    }
}

export default TaskController;
