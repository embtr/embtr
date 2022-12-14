import { plannedTaskIsComplete, plannedTaskIsFailed } from 'src/controller/planning/PlannedDayController';
import { PlannedTaskModel } from 'src/controller/planning/PlannedTaskController';
import { PlannedTaskHistoryElementModel, PlannedTaskHistoryModel } from 'src/model/Models';

export const updatePlannedTaskHistory = (plannedTaskHistory: PlannedTaskHistoryModel, plannedTask: PlannedTaskModel): PlannedTaskHistoryModel => {
    if (!plannedTask.id || !plannedTask.dayKey || !plannedTask.routine.id) {
        return plannedTaskHistory;
    }

    const plannedTaskHistoryElement: PlannedTaskHistoryElementModel = {
        dayKey: plannedTask.dayKey,
        id: plannedTask.id,
        name: plannedTask.routine.name,
        status: plannedTask.status ? plannedTask.status : 'INCOMPLETE',
    };

    const clone: PlannedTaskHistoryModel = { ...plannedTaskHistory };

    clone.incomplete = removeElementFromArray(clone.incomplete, plannedTaskHistoryElement);
    clone.complete = removeElementFromArray(clone.complete, plannedTaskHistoryElement);
    clone.failed = removeElementFromArray(clone.failed, plannedTaskHistoryElement);

    if (plannedTaskIsComplete(plannedTask)) {
        clone.complete.push(plannedTaskHistoryElement);
    } else if (plannedTaskIsFailed(plannedTask)) {
        clone.failed.push(plannedTaskHistoryElement);
    } else {
        clone.incomplete.push(plannedTaskHistoryElement);
    }

    return clone;
};

const removeElementFromArray = (list: PlannedTaskHistoryElementModel[], element: PlannedTaskHistoryElementModel) => {
    const newList: PlannedTaskHistoryElementModel[] = [];
    list.forEach((l) => {
        if (l.id === element.id) {
            return;
        }
        newList.push(l);
    });

    return newList;
};
