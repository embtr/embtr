import { TimeOfDay } from 'resources/schema';

export interface NewPlannedHabitData {
    scheduledHabitId: number;
    dayKey: string;
    timeOfDay?: TimeOfDay;
    originalTimeOfDayId?: number;
}
