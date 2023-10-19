import { TimeOfDay } from "resources/schema";

export class TimeOfDayUtility {
    public static getTimeOfDayPretty(timeOfDay?: TimeOfDay): string {
        if (!timeOfDay) {
            return 'Add Day'
        } 

        if (!timeOfDay.period) {
            return '';
        }

        const prettyTimeOfDay = timeOfDay.period.charAt(0).toUpperCase() + timeOfDay.period.slice(1).toLowerCase();
        return prettyTimeOfDay;
    }
}

