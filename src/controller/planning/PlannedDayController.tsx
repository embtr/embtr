import { RoutineModel } from "src/controller/planning/RoutineController";
import PlannedDayDao from "src/firebase/firestore/planning/PlannedDayDao";

export interface PlannedDay {
    id?: string,
    plannedTasks: PlannedTask[]
}

export interface PlannedTask {
    routine: RoutineModel,
    startMinute?: number,
    duration?: number
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

class PlannedDayController {
    public static get(id: string, callback: Function) {
        let plannedDay: PlannedDay = {
            id: id,
            plannedTasks: []
        }

        const response = PlannedDayDao.get(id);
        response.then(collection => {
            collection?.forEach(plannedTask => {
                plannedDay.plannedTasks.push(plannedTask.data() as PlannedTask);
            });
        }).then(() => {
            callback(plannedDay);
        });
    }

    public static delete(id: string, callback: Function) {
        PlannedDayDao.delete(id, callback);
    }

    public static create(plannedDay: PlannedDay) {
        PlannedDayDao.create(plannedDay);
    }
}

export default PlannedDayController;