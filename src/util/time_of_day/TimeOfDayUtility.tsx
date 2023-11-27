import { TimeOfDay } from 'resources/schema';

export namespace TimeOfDayUtility {
    export const MORNING_ICON = require('assets/time_of_day/morning.png');
    export const AFTERNOON_ICON = require('assets/time_of_day/afternoon.png');
    export const EVENING_ICON = require('assets/time_of_day/evening.png');
    export const NIGHT_ICON = require('assets/time_of_day/night.png');

    export function getTimeOfDayPretty(timeOfDay?: TimeOfDay): string {
        if (!timeOfDay) {
            return 'All Day';
        }

        if (!timeOfDay.period) {
            return '';
        }

        const prettyTimeOfDay =
            timeOfDay.period.charAt(0).toUpperCase() + timeOfDay.period.slice(1).toLowerCase();
        return prettyTimeOfDay;
    }

    export function isMorning(timeOfDay?: TimeOfDay): boolean {
        if (!timeOfDay) {
            return false;
        }

        return timeOfDay.period === 'MORNING';
    }

    export function isAfternoon(timeOfDay?: TimeOfDay): boolean {
        if (!timeOfDay) {
            return false;
        }

        return timeOfDay.period === 'AFTERNOON';
    }

    export function isEvening(timeOfDay?: TimeOfDay): boolean {
        if (!timeOfDay) {
            return false;
        }

        return timeOfDay.period === 'EVENING';
    }

    export function isNight(timeOfDay?: TimeOfDay): boolean {
        if (!timeOfDay) {
            return false;
        }

        return timeOfDay.period === 'NIGHT';
    }

    export function getTimeOfDayIcon(timeOfDay?: TimeOfDay) {
        if (TimeOfDayUtility.isMorning(timeOfDay)) {
            return TimeOfDayUtility.MORNING_ICON;
        } else if (TimeOfDayUtility.isAfternoon(timeOfDay)) {
            return TimeOfDayUtility.AFTERNOON_ICON;
        } else if (TimeOfDayUtility.isEvening(timeOfDay)) {
            return TimeOfDayUtility.EVENING_ICON;
        } else if (TimeOfDayUtility.isNight(timeOfDay)) {
            return TimeOfDayUtility.NIGHT_ICON;
        }

        return '';
    }
}
