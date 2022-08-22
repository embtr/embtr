import { getAuth } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { Tasks } from "src/components/plan/tasks/Tasks";
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
    status: string,
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

    if (hours > 12) {
        hours = hours - 12;
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


export const getKey = (dayOfMonth: number) => {
    const date = new Date();
    date.setDate(dayOfMonth);

    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + dayOfMonth).slice(-2);
    let year = date.getFullYear();

    return month + day + year;
}

export const getDayKey = (day: number) => {
    return getKey(day);
}

export const getTodayKey = () => {
    return getKey(new Date().getDate());
}

export const getTomorrowKey = () => {
    return getKey(new Date().getDate() + 1);
}

export const getDayFromDayKey = (dayKey: string) => {
    return parseInt(dayKey.substring(2, 4));
}

class PlannedDayController {
    public static getOrCreate(id: string, callback: Function) {
        let plannedDay: PlannedDay = {
            id: id,
            metadata: this.createMetadata(),
            plannedTasks: []
        }

        const response = PlannedDayDao.get(getAuth().currentUser?.uid!, id);
        response.then(collection => {
            if (collection?.empty) {
                this.create(plannedDay, callback);
            } else {
                collection?.forEach(currentPlannedTask => {
                    if (currentPlannedTask.id === "metadata") {
                        plannedDay.metadata = currentPlannedTask.data() as PlannedDayMetadata;
                    } else {
                        let plannedTask: PlannedTaskModel = currentPlannedTask.data() as PlannedTaskModel;
                        plannedTask.id = currentPlannedTask.id;
                        plannedDay.plannedTasks.push(plannedTask);
                    }
                });
            }

        }).then(() => {
            plannedDay.plannedTasks.sort((a, b) => ((a.startMinute ? a.startMinute : a.routine.added) > (b.startMinute ? b.startMinute : b.routine.added) ? 1 : -1));
            callback(plannedDay);
        });
    }

    public static get(uid: string, id: string, callback: Function) {
        let plannedDay: PlannedDay = {
            id: id,
            metadata: this.createMetadata(),
            plannedTasks: []
        }

        const response = PlannedDayDao.get(uid, id);
        response.then(collection => {
            collection?.forEach(currentPlannedTask => {
                if (currentPlannedTask.id === "metadata") {
                    plannedDay.metadata = currentPlannedTask.data() as PlannedDayMetadata;
                } else {
                    let plannedTask: PlannedTaskModel = currentPlannedTask.data() as PlannedTaskModel;
                    if (plannedTask.status === "DELETED") {
                        return;
                    }

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

    public static getTask(uid: string, dayKey: string, plannedTaskId: string, callback: Function) {
        this.get(uid, dayKey, (plannedDay: PlannedDay) => {
            plannedDay.plannedTasks.forEach(plannedTask => {
                if (plannedTask.id === plannedTaskId) {
                    callback(plannedTask);
                }
            });
        });
    }

    public static updateTask(plannedDay: PlannedDay, plannedTask: PlannedTaskModel, callback: Function) {
        plannedDay.metadata!.modified = Timestamp.now();
        if (!plannedDay.metadata) {
            plannedDay.metadata = this.createMetadata();
        }

        plannedDay.metadata!.status = this.getPlannedDayStatus(plannedDay, plannedTask);
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
            status: "INCOMPLETE",
            modified: Timestamp.now(),
            locked: true
        };

        return metadata;
    }

    private static getPlannedDayStatus = (plannedDay: PlannedDay, plannedTask: PlannedTaskModel): string => {
        let status = "COMPLETE";
        plannedDay.plannedTasks.forEach((currentPlannedTask) => {
            let taskStatus = currentPlannedTask.status;
            if (plannedTask.id === currentPlannedTask.id) {
                taskStatus = plannedTask.status;
            }
            
            if (taskStatus !== "COMPLETE") {
                if (taskStatus === "FAILED") {
                    status = "FAILED";
                    return;
                }

                status = "INCOMPLETE";
            }
        });

        return status;
    }
}

export default PlannedDayController;