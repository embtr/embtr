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
            }

            throw new Error('Invalid Habit namespace key: ' + key);
        };
    }

    export namespace Profile {
        export const VERIFIED_BADGE = require('assets/verify.png');
        export const VERIFIED_BADGE_WHITE = require('assets/verify_white.png');
        export const PREMIUM_BADGE = require('assets/logo.png');
        export const HEART_BADGE_BACKGROUND = require('assets/black_heart.png');
        export const PADLOCK = require('assets/padlock.png');
        export const NEW_USER = require('assets/new_user.png');
        export const HABIT_STREAK_GOLD = require('assets/gold_fire.png');
        export const HABIT_STREAK_PURPLE = require('assets/purple_fire.png');
        export const HABIT_STREAK = require('assets/fire.png');
        export const HABIT_STREAK_SMALL = require('assets/wood.png');

        export const get = (key: string) => {
            switch (key) {
                case 'PREMIUM_BADGE':
                    return PREMIUM_BADGE;
                case 'VERIFIED_BADGE':
                    return VERIFIED_BADGE;
                case 'VERIFIED_BADGE_WHITE':
                    return VERIFIED_BADGE_WHITE;
                case 'HEART_BADGE_BACKGROUND':
                    return HEART_BADGE_BACKGROUND;
                case 'PADLOCK':
                    return PADLOCK;
                case 'NEW_USER':
                    return NEW_USER;
                case 'HABIT_STREAK_GOLD':
                    return HABIT_STREAK_GOLD;
                case 'HABIT_STREAK_PURPLE':
                    return HABIT_STREAK_PURPLE;
                case 'HABIT_STREAK':
                    return HABIT_STREAK;
                case 'HABIT_STREAK_SMALL':
                    return HABIT_STREAK_SMALL;
            }

            throw new Error('Invalid Profile namespace key: ' + key);
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
            case 'PROFILE':
                return Profile.get(key);
        }

        throw new Error('Invalid ImageRepo namespace: ' + namespace);
    };
}
