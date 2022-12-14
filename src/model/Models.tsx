export interface PlannedTaskHistoryModel {
    complete: PlannedTaskHistoryElementModel[];
    incomplete: PlannedTaskHistoryElementModel[];
    failed: PlannedTaskHistoryElementModel[];
}

export interface PlannedTaskHistoryElementModel {
    dayKey: string;
    id: string;
    name: string;
    status: string;
}
