import { TimeOfDay } from 'resources/schema';

export namespace TimeOfDayUtility {
    export const MORNING_ICON =
        'https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/assets%2Ftime_of_day%2Fmorning.svg?alt=media';
    export const AFTERNOON_ICON =
        'https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/assets%2Ftime_of_day%2Fafternoon.svg?alt=media';
    export const EVENING_ICON =
        'https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/assets%2Ftime_of_day%2Fevening.svg?alt=media';
    export const NIGHT_ICON =
        'https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/assets%2Ftime_of_day%2Fnight.svg?alt=media';

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
