export namespace LocalImageRepo {
    export namespace TimeOfDay {
        export const MORNING_ICON = require('assets/time_of_day/morning.png');
        export const AFTERNOON_ICON = require('assets/time_of_day/afternoon.png');
        export const EVENING_ICON = require('assets/time_of_day/evening.png');
        export const NIGHT_ICON = require('assets/time_of_day/night.png');

        export const get = (key: string) => {
            switch (key) {
                case 'MORNING':
                    return MORNING_ICON;
                case 'AFTERNOON':
                    return AFTERNOON_ICON;
                case 'EVENING':
                    return EVENING_ICON;
                case 'NIGHT':
                    return NIGHT_ICON;
                default:
                    return null;
            }
        };
    }

    export namespace Habit {
        export const TROPHY = require('assets/habit/trophy.png');
        export const CUSTOM_HABITS_PLACEHOLDER = require('assets/habit/custom_habits_placeholder.png');
        export const get = (key: string) => {
            switch (key) {
                case 'TROPHY':
                    return TROPHY;
                case 'CUSTOM_HABITS_PLACEHOLDER':
                    return CUSTOM_HABITS_PLACEHOLDER;
                default:
                    return null;
            }
        };
    }

    export const get = (string: string) => {
        const namespace = string.split('.')[0];
        const key = string.split('.')[1];

        switch (namespace) {
            case 'TIME_OF_DAY':
                return TimeOfDay.get(key);
            case 'HABIT':
                return Habit.get(key);
            default:
                return null;
        }
    };
}
