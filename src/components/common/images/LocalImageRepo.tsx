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

    export namespace HabitStreakTier {
        export const LOGS = require('assets/habit_streak_tier/logs.png');
        export const COMMON = require('assets/habit_streak_tier/common-fire.png');
        export const UNCOMMON = require('assets/habit_streak_tier/uncommon-fire.png');
        export const RARE = require('assets/habit_streak_tier/rare-fire.png');
        export const EPIC = require('assets/habit_streak_tier/epic-fire.png');
        export const LEGENDARY = require('assets/habit_streak_tier/legendary-fire.png');
        export const MYTHICAL = require('assets/habit_streak_tier/mythical-fire.png');

        export const get = (key: string) => {
            switch (key) {
                case 'LOGS':
                    return LOGS;
                case 'COMMON':
                    return COMMON;
                case 'UNCOMMON':
                    return UNCOMMON;
                case 'RARE':
                    return RARE;
                case 'EPIC':
                    return EPIC;
                case 'LEGENDARY':
                    return LEGENDARY;
                case 'MYTHICAL':
                    return MYTHICAL;
            }

            return undefined;
        };
    }

    export namespace Profile {
        export const PREMIUM_BADGE = require('assets/premium.png');
        export const PREMIUM = require('assets/premium.png');
        export const HEART_BADGE_BACKGROUND = require('assets/black_heart.png');
        export const PADLOCK = require('assets/padlock.png');
        export const NEW_USER = require('assets/new_user.png');
        export const AWAY = require('assets/away.png');

        export const get = (key: string) => {
            switch (key) {
                case 'PREMIUM_BADGE':
                    return PREMIUM_BADGE;
                case 'PREMIUM':
                    return PREMIUM;
                case 'HEART_BADGE_BACKGROUND':
                    return HEART_BADGE_BACKGROUND;
                case 'PADLOCK':
                    return PADLOCK;
                case 'NEW_USER':
                    return NEW_USER;
                case 'AWAY':
                    return AWAY;
            }

            throw new Error('Invalid Profile namespace key: ' + key);
        };
    }

    export namespace General {
        export const POINTS = require('assets/points.png');
        export const POINTS_LEVEL_1 = require('assets/points_level_1.png');
        export const LOGO = require('assets/app_icon.png');

        export const get = (key: string) => {
            switch (key) {
                case 'POINTS':
                    return POINTS;
                case 'POINTS_LEVEL_1':
                    return POINTS_LEVEL_1;
                case 'LOGO':
                    return LOGO;
            }

            throw new Error('Invalid General namespace key: ' + key);
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
            case 'HABIT_STREAK_TIER':
                return HabitStreakTier.get(key);
            case 'GENERAL':
                return General.get(key);
        }

        return undefined;
    };
}
