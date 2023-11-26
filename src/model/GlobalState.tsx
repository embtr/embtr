import { PlannedTask } from "resources/schema";

export interface UpdateModalPlannedTask {
    plannedTask: PlannedTask;
    callback: Function;
}

export const DEFAULT_UPDATE_MODAL_PLANNED_TASK: UpdateModalPlannedTask = {
    plannedTask: {
        title: '',
        description: '',
        quantity: 0,
        completedQuantity: 0,
    },
    callback: () => {},
};