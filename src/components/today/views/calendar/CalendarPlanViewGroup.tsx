import { PlannedTaskModel } from "src/controller/planning/PlannedDayController";

export const GeneratePlanViewGroups = (tasks: PlannedTaskModel[]): CalendarPlanViewGroup[] => {
    let calendarPlanViewGroups: CalendarPlanViewGroup[] = [];

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];

        let found = false;
        calendarPlanViewGroups.forEach(group => {
            if (group.taskFitsInGroup(task)) {
                group.addTask(task);
                found = true;
                return;
            }
        });

        //if any groups overlap - join them

        if (!found) {
            let newGroup: CalendarPlanViewGroup = new CalendarPlanViewGroup();
            newGroup.addTask(task);
            calendarPlanViewGroups.push(newGroup);
        }
    }

    return calendarPlanViewGroups;
}

export class CalendarPlanViewGroup {
    private tasks: PlannedTaskModel[];
    private start: number;
    private end: number;

    constructor() {
        this.tasks = [];
        this.start = 99999;
        this.end = 0;
    }

    public addTask(task: PlannedTaskModel) {
        if (task.startMinute && task.startMinute < this.start) {
            this.start = task.startMinute;
        }

        let endMinute = 0;
        if (task.startMinute && task.duration) {
            endMinute = task.startMinute + task.duration;
        }

        if (endMinute > this.end) {
            this.end = endMinute;
        }

        this.tasks.push(task);
    }

    public taskFitsInGroup(task: PlannedTaskModel): boolean {
        if (!task.startMinute || !task.duration) {
            return false;
        }

        const startMinute = task.startMinute;
        const endMinute = task.startMinute + task.duration;

        if (startMinute <= this.start && endMinute >= this.end) {
            return true;
        }

        if (startMinute <= this.start && endMinute >= this.start && endMinute <= this.end) {
            return true;
        }

        if (endMinute >= this.end && startMinute <= this.end && startMinute >= this.start) {
            return true;
        }

        if (startMinute >= this.start && startMinute <= this.end && endMinute >= this.start && endMinute <= this.end) {
            return true;
        }

        return false;
    }

    public getTasks(): PlannedTaskModel[] {
        this.tasks.sort((a, b) => ((a.startMinute ? a.startMinute : 0) > (b.startMinute ? b.startMinute : 0)) ? 1 : -1);
        return this.tasks;
    }

    public toString() {
        return "" + this.start + " => " + this.end + " [tasks: " + this.tasks.length + "]";
    }
}