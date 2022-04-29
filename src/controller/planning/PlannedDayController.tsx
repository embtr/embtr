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
    startMinute?: number,
    duration?: number
}

export interface PlannedDayMetadata {
    added: Timestamp,
    modified: Timestamp,
    locked: boolean
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

export const getTodayKey = () => {
    return getKey(0);
}

export const getTomorrowKey = () => {
    return getKey(1);
}

class PlannedDayController {
    public static get(id: string, callback: Function) {
        console.log("seeking: " + id);
        let plannedDay: PlannedDay = {
            id: id,
            metadata: undefined,
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

    public static update(plannedDay: PlannedDay) {
        plannedDay.metadata!.modified = Timestamp.now();
        PlannedDayDao.update(plannedDay);
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