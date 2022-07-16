import { Timestamp } from "firebase/firestore";
import { TaskModel } from "src/controller/planning/TaskController";
import PlannedDayDao from "src/firebase/firestore/planning/PlannedDayDao";

export interface PlannedDay {
    id?: string,
    metadata?: PlannedDayMetadata,
    plannedTasks: PlannedTaskModel[]
}

export interface PlannedTaskModel {
    id?: string,
    routine: TaskModel,
    status?: string,
    startMinute?: number,
    duration?: number
}

export interface PlannedDayMetadata {
    added: Timestamp,
    modified: Timestamp,
    locked: boolean
}

export const getStartTimePretty = (plannedTask: PlannedTaskModel) => {
    const startTime = plannedTask.startMinute;
    if (startTime === undefined) {
        return "0:00 AM"
    }

    let hours = Math.floor(startTime / 60);
    if (hours == 0) {
        hours = 1;
    }

    let minutes = "" + startTime % 60;
    if (minutes.length == 1) {
        minutes = "0" + minutes;
    }

    const AmPm = startTime >= (12 * 60) ? "PM" : "AM";

    return hours + ":" + minutes + " " + AmPm;


}

export const plannedTaskIsComplete = (plannedTask: PlannedTaskModel): boolean => {
    return plannedTask.status === "COMPLETE";
};

export const plannedTaskIsFailed = (plannedTask: PlannedTaskModel): boolean => {
    return plannedTask.status === "FAILED";
};

export const plannedTaskIsIncomplete = (plannedTask: PlannedTaskModel): boolean => {
    return !plannedTaskIsComplete(plannedTask) && !plannedTaskIsFailed(plannedTask);
};

export const createPlannedTaskByPlannedTask = (plannedTask: PlannedTaskModel, startMinute: number, duration: number) => {
    const newPlannedTask: PlannedTaskModel = {
        ...plannedTask
    }
    newPlannedTask.startMinute = startMinute;
    newPlannedTask.duration = duration;

    return newPlannedTask;
}

export const createPlannedTask = (task: TaskModel, startMinute: number, duration: number) => {
    const plannedTask: PlannedTaskModel = {
        routine: task,
        startMinute: startMinute,
        duration: duration
    }

    return plannedTask;
}


export const getKey = (daysBack: number) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + daysBack);

    const elements = tomorrow.toLocaleDateString("en-US").split("/");
    const month = elements[0].length == 1 ? "0" + elements[0] : elements[0];
    const day = elements[1].length == 1 ? "0" + elements[1] : elements[1];
    const year = elements[2];

    return month + day + year;
}

export const getDayKey = (day: number) => {
    const todayDay = getDayFromDayKey(getTodayKey());
    return getKey(day - todayDay);
}

export const getTodayKey = () => {
    return getKey(0);
}

export const getTomorrowKey = () => {
    return getKey(1);
}

export const getDayFromDayKey = (dayKey: string) => {
    return parseInt(dayKey.substring(2, 4));
}

class PlannedDayController {
    public static get(id: string, callback: Function) {
        let plannedDay: PlannedDay = {
            id: id,
            metadata: this.createMetadata(),
            plannedTasks: []
        }

        const response = PlannedDayDao.get(id);
        response.then(collection => {
            collection?.forEach(currentPlannedTask => {
                if (currentPlannedTask.id === "metadata") {
                    plannedDay.metadata = currentPlannedTask.data() as PlannedDayMetadata;
                } else {
                    let plannedTask: PlannedTaskModel = currentPlannedTask.data() as PlannedTaskModel;
                    plannedTask.id = currentPlannedTask.id;
                    plannedDay.plannedTasks.push(plannedTask);
                }
            });
        }).then(() => {
            plannedDay.plannedTasks.sort((a, b) => ((a.startMinute ? a.startMinute : a.routine.added) > (b.startMinute ? b.startMinute : b.routine.added) ? 1 : -1));
            callback(plannedDay);
        });
    }

    public static delete(id: string, callback: Function) {
        PlannedDayDao.delete(id, callback);
    }

    public static create(plannedDay: PlannedDay, callback: Function) {
        plannedDay.metadata = this.createMetadata();
        PlannedDayDao.create(plannedDay);

        callback(plannedDay);
    }

    public static replace(plannedDay: PlannedDay) {
        plannedDay.metadata!.modified = Timestamp.now();
        PlannedDayDao.replace(plannedDay);
    }

    public static updateTask(plannedDay: PlannedDay, plannedTask: PlannedTaskModel, callback: Function) {
        plannedDay.metadata!.modified = Timestamp.now();
        const result = PlannedDayDao.updateTask(plannedDay, plannedTask);
        result?.then(() => {
            callback();
        });
    }

    public static addTask(plannedDay: PlannedDay, plannedTask: PlannedTaskModel, callback: Function) {
        plannedDay.metadata!.modified = Timestamp.now();
        const result = PlannedDayDao.createTask(plannedDay, plannedTask);
        result?.then(() => {
            callback();
        });
    }

    private static createMetadata(): PlannedDayMetadata {
        const metadata: PlannedDayMetadata = {
            added: Timestamp.now(),
            modified: Timestamp.now(),
            locked: true
        };

        return metadata;
    }
}

export default PlannedDayController;