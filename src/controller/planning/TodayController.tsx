import { Timestamp } from "firebase/firestore";
import { TaskModel } from "src/controller/planning/TaskController";
import TodayDao from "src/firebase/firestore/today/TodayDao";

export interface TodayModel {
    id?: string,
    metadata?: TodayMedadata,
    plannedTasks: PlannedTask[]
}

export interface PlannedTask {
    id?: string,
    routine: TaskModel,
    startMinute?: number,
    duration?: number
}

export interface TodayMedadata {
    added: Timestamp,
    modified: Timestamp,
    locked: boolean
}

export const getTomorrowKey = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const elements = tomorrow.toLocaleDateString("en-US").split("/");
    const month = elements[0].length == 1 ? "0" + elements[0] : elements[0];
    const day = elements[1].length == 1 ? "0" + elements[1] : elements[1];
    const year = elements[2];

    return month + day + year;
}

class TodayController {
    public static get(id: string, callback: Function) {
        let todayModel: TodayModel = {
            id: id,
            metadata: undefined,
            plannedTasks: []
        }

        const response = TodayDao.get(id);
        response.then(collection => {
            collection?.forEach(currentPlannedTask => {
                if (currentPlannedTask.id === "metadata") {
                    todayModel.metadata = currentPlannedTask.data() as TodayMedadata;
                } else {
                    let plannedTask: PlannedTask = currentPlannedTask.data() as PlannedTask;
                    plannedTask.id = currentPlannedTask.id;
                    todayModel.plannedTasks.push(plannedTask);
                }
            });
        }).then(() => {
            callback(todayModel);
        });
    }

    public static delete(id: string, callback: Function) {
        TodayDao.delete(id, callback);
    }

    public static create(todayModel: TodayModel, callback: Function) {
        todayModel.metadata = this.createMetadata();
        TodayDao.create(todayModel);
        
        callback(todayModel);
    }

    public static update(todayModel: TodayModel) {
        todayModel.metadata!.modified = Timestamp.now();
        TodayDao.update(todayModel);
    }

    private static createMetadata(): TodayMedadata {
        const metadata: TodayMedadata = {
            added: Timestamp.now(),
            modified: Timestamp.now(),
            locked: true
        };

        return metadata;
    }
}

export default TodayController;