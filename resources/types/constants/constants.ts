export namespace Constants {
    export enum UserPropertyKey {
        INVALID = 'INVALID',
        TIMEZONE = 'TIMEZONE',
        NEW_USER_CHECKLIST_DISMISSED = 'NEW_USER_CHECKLIST_DISMISSED',
        NEW_USER_CHECKLIST_COMPLETED = 'NEW_USER_CHECKLIST_COMPLETED',
        INTRO_ACKNOWLEDGED = 'INTRO_ACKNOWLEDGED',
        SOCIAL_NOTIFICATIONS_SETTING = 'SOCIAL_NOTIFICATIONS_SETTING',
        REMINDER_NOTIFICATIONS_SETTING = 'REMINDER_NOTIFICATIONS_SETTING',
        WARNING_NOTIFICATIONS_SETTING = 'WARNING_NOTIFICATIONS_SETTING',
        AWAY_MODE = 'AWAY_MODE',
    }

    export const getUserPropertyKey = (key: string): UserPropertyKey => {
        switch (key) {
            case 'TIME_ZONE':
                return UserPropertyKey.TIMEZONE;
            case 'NEW_USER_CHECKLIST_DISMISSED':
                return UserPropertyKey.NEW_USER_CHECKLIST_DISMISSED;
            case 'NEW_USER_CHECKLIST_COMPLETED':
                return UserPropertyKey.NEW_USER_CHECKLIST_COMPLETED;
            case 'INTRO_ACKNOWLEDGED':
                return UserPropertyKey.INTRO_ACKNOWLEDGED;
            case 'AWAY_MODE':
                return UserPropertyKey.AWAY_MODE;
            case 'INVALID':
                return UserPropertyKey.INVALID;

            default:
                return UserPropertyKey.INVALID;
        }
    };

    /*
     * COMPLETION STATES
     */
    export enum CompletionState {
        INVALID = 'INVALID',
        COMPLETE = 'COMPLETE',
        INCOMPLETE = 'INCOMPLETE',
        FAILED = 'FAILED',
        SKIPPED = 'SKIPPED',
        NO_SCHEDULE = 'NO_SCHEDULE',
        AWAY = 'AWAY',
    }
    export const getCompletionState = (state: string): CompletionState => {
        switch (state) {
            case 'COMPLETE':
                return CompletionState.COMPLETE;
            case 'INCOMPLETE':
                return CompletionState.INCOMPLETE;
            case 'FAILED':
                return CompletionState.FAILED;
            case 'SKIPPED':
                return CompletionState.SKIPPED;
            case 'NO_SCHEDULE':
                return CompletionState.NO_SCHEDULE;
            case 'AWAY':
                return CompletionState.AWAY;

            default:
                return CompletionState.INVALID;
        }
    };

    /*
     * SOCIAL NOTIFICATIONS SETTING
     */
    export enum SocialNotificationSetting {
        INVALID = 'INVALID',
        ENABLED = 'ENABLED',
        DISABLED = 'DISABLED',
    }

    export const getSocialNotificationsSetting = (state: string): SocialNotificationSetting => {
        switch (state) {
            case 'ENABLED':
                return SocialNotificationSetting.ENABLED;
            case 'DISABLED':
                return SocialNotificationSetting.DISABLED;

            default:
                return SocialNotificationSetting.INVALID;
        }
    };

    /*
     * REMINDER NOTIFICATIONS SETTING
     */
    export enum ReminderNotificationSetting {
        INVALID = 'INVALID',
        DISABLED = 'DISABLED',
        DAILY = 'DAILY',
        PERIODICALLY = 'PERIODICALLY',
    }

    export const getReminderNotificationsSetting = (state: string): ReminderNotificationSetting => {
        switch (state) {
            case 'DISABLED':
                return ReminderNotificationSetting.DISABLED;
            case 'DAILY':
                return ReminderNotificationSetting.DAILY;
            case 'PERIODICALLY':
                return ReminderNotificationSetting.PERIODICALLY;

            default:
                return ReminderNotificationSetting.INVALID;
        }
    };

    export enum WarningNotificationSetting {
        INVALID = 'INVALID',
        DISABLED = 'DISABLED',
        DAILY = 'DAILY',
        PERIODICALLY = 'PERIODICALLY',
    }

    export const getWarningNotificationSetting = (state: string): WarningNotificationSetting => {
        switch (state) {
            case 'DISABLED':
                return WarningNotificationSetting.DISABLED;
            case 'DAILY':
                return WarningNotificationSetting.DAILY;
            case 'PERIODICALLY':
                return WarningNotificationSetting.PERIODICALLY;

            default:
                return WarningNotificationSetting.INVALID;
        }
    };

    export enum Period {
        INVALID = 'INVALID',
        MORNING = 'MORNING',
        AFTERNOON = 'AFTERNOON',
        EVENING = 'EVENING',
        NIGHT = 'NIGHT',
        DEFAULT = 'DEFAULT',
    }

    export const getPeriod = (period: string): Period => {
        switch (period) {
            case 'MORNING':
                return Period.MORNING;
            case 'AFTERNOON':
                return Period.AFTERNOON;
            case 'EVENING':
                return Period.EVENING;
            case 'NIGHT':
                return Period.NIGHT;
            case 'DEFAULT':
                return Period.DEFAULT;

            default:
                return Period.INVALID;
        }
    };

    export enum TaskType {
        INVALID = 'INVALID',
        DEFAULT = 'DEFAULT',
        CHALLENGE = 'CHALLENGE',
    }

    export const getScheduledHabitType = (type: string): TaskType => {
        switch (type) {
            case 'DEFAULT':
                return TaskType.DEFAULT;
            case 'CHALLENGE':
                return TaskType.CHALLENGE;
        }

        return TaskType.INVALID;
    };

    export enum AwayMode {
        INVALID = 'INVALID',
        ENABLED = 'ENABLED',
        DISABLED = 'DISABLED',
    }

    export const getAwayMode = (state: string): AwayMode => {
        switch (state) {
            case 'ENABLED':
                return AwayMode.ENABLED;
            case 'DISABLED':
                return AwayMode.DISABLED;

            default:
                return AwayMode.INVALID;
        }
    };

    export enum HabitStreakType {
        INVALID = 'INVALID',
        LONGEST = 'LONGEST',
        CURRENT = 'CURRENT',
    }

    export const getStreakType = (type: string): HabitStreakType => {
        switch (type) {
            case 'LONGEST':
                return HabitStreakType.LONGEST;
            case 'CURRENT':
                return HabitStreakType.CURRENT;

            default:
                return HabitStreakType.INVALID;
        }
    };

    export enum BadgeCategory {
        INVALID = 'INVALID',
        MEMBERSHIP = 'MEMBERSHIP',
        AWAY = 'AWAY',
        NEW_USER = 'NEW_USER',
        HABIT_STREAK_TIER = 'HABIT_STREAK_TIER',
    }

    export const getBadgeCategory = (category: string): BadgeCategory => {
        switch (category) {
            case 'MEMBERSHIP':
                return BadgeCategory.MEMBERSHIP;
            case 'AWAY':
                return BadgeCategory.AWAY;
            case 'NEW_USER':
                return BadgeCategory.NEW_USER;
            case 'HABIT_STREAK_TIER':
                return BadgeCategory.HABIT_STREAK_TIER;

            default:
                return BadgeCategory.INVALID;
        }
    };

    export enum Badge {
        INVALID = 'INVALID',
        PREMIUM = 'PREMIUM',
        AWAY = 'AWAY',
        NEW_USER = 'NEW_USER',
        LOGS = 'LOGS',
        COMMON = 'COMMON',
        UNCOMMON = 'UNCOMMON',
        RARE = 'RARE',
        EPIC = 'EPIC',
        LEGENDARY = 'LEGENDARY',
        MYTHICAL = 'MYTHICAL',
        RED = 'RED',
        FINAL_FIRE = 'FINAL_FIRE',
        ETERNAL_FLAME = 'ETERNAL_FLAME',
    }

    export const getBadge = (badge: string): Badge => {
        switch (badge) {
            case 'PREMIUM':
                return Badge.PREMIUM;
            case 'AWAY':
                return Badge.AWAY;
            case 'NEW_USER':
                return Badge.NEW_USER;
            case 'LOGS':
                return Badge.LOGS;
            case 'COMMON':
                return Badge.COMMON;
            case 'UNCOMMON':
                return Badge.UNCOMMON;
            case 'RARE':
                return Badge.RARE;
            case 'EPIC':
                return Badge.EPIC;
            case 'LEGENDARY':
                return Badge.LEGENDARY;
            case 'MYTHICAL':
                return Badge.MYTHICAL;
            case 'RED':
                return Badge.RED;
            case 'FINAL_FIRE':
                return Badge.FINAL_FIRE;
            case 'ETERNAL_FLAME':
                return Badge.ETERNAL_FLAME;

            default:
                return Badge.INVALID;
        }
    };
}
