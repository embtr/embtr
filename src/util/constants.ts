import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getSafeWindowWidth, getWindowWidth } from './GeneralUtility';
import { isExtraWideDevice } from 'src/util/DeviceUtil';

export const USER_SEARCH_WIDTH = '95%';

export const PADDING_LARGE = 12;
export const PADDING_MEDIUM = PADDING_LARGE * 0.75;
export const PADDING_SMALL = PADDING_LARGE * 0.5;
export const PADDING_TINY = PADDING_LARGE * 0.25;
export const TIMELINE_CARD_ICON_SIZE = 25;
export const TIMELINE_CARD_ICON_COUNT_SIZE = 12;

// COMMENTS
export const COMMENT_ICON_SIZE = 20;

//TODAY
export const CALENDAR_TIME_INDICATOR_DOT_SIZE = 20;
export const CALENDAR_TIME_HEIGHT = 15;

export const CARD_SHADOW = {
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
};

//SyMBOLS
export const SYMBOL_SIZE_LARGE = 28;
export const SYMBOL_SIZE_SMALL = 16;
export const SYMBOL_FONT_SIZE_LARGE = 15;
export const SYMBOL_FONT_SIZE_SMALL = 10;
export const SYMBOL_BORDER_RADIUS_LARGE = 9;
export const SYMBOL_BORDER_RADIUS_SMALL = 5;
export const SYMBOL_BORDER_WIDTH_LARGE = 1.3;
export const SYMBOL_BORDER_WIDTH_SMALL = 1;

//FONTS
export const POPPINS_REGULAR = 'Poppins_400Regular';
export const POPPINS_REGULAR_ITALIC = 'Poppins_400Regular_Italic';
export const POPPINS_MEDIUM = 'Poppins_500Medium';
export const POPPINS_SEMI_BOLD = 'Poppins_600SemiBold';

//WIDGETS
export const TIME_LEFT_IN_DAY_WIDGET = 'Time Left In Day';
export const TIME_LEFT_IN_DAY_WIDGET_DESCRIPTION =
    'A snapshot of how much time remains in the day.';

export const QUOTE_OF_THE_DAY_WIDGET = 'Quote Of The Day';
export const TODAYS_TASKS_WIDGET = "Today's Tasks";
export const TODAYS_TASKS_WIDGET_DESCRIPTION = "A list of today's tasks.";
export const TODAYS_PHOTOS_WIDGET = "Today's Photos";
export const TODAYS_NOTES_WIDGET = "Today's Notes";

export const UPCOMING_GOALS_WIDGET = 'Upcoming Goals';
export const DAILY_HISTORY_WIDGET = 'Daily History';

export const PILLARS_WIDGET = 'Pillars Widget';

export const WIDGETS = [
    TIME_LEFT_IN_DAY_WIDGET,
    QUOTE_OF_THE_DAY_WIDGET,
    TODAYS_TASKS_WIDGET,
    TODAYS_PHOTOS_WIDGET,
    TODAYS_NOTES_WIDGET,
    UPCOMING_GOALS_WIDGET,
    DAILY_HISTORY_WIDGET,
    PILLARS_WIDGET,
];

export const WIDGET_LIKE_ICON_SIZE = 20;

export type IoniconName = keyof typeof Ionicons.glyphMap;
export type MaterialCommunityIconName = keyof typeof MaterialCommunityIcons.glyphMap;

export namespace ReactQueryStaleTimes {
    export const INSTANTLY = 0;
    export const INFINITY = Infinity;
}

export namespace UI {
    export namespace SCHEDULE_HABIT {
        export namespace REPEATING_SCHEDULE {
            const totalDayOfWeekWidth = getSafeWindowWidth() - (PADDING_LARGE / 3) * 7;
            export const DAY_OF_WEEK_WIDTH = totalDayOfWeekWidth / 7;
            export const GAP_BETWEEN_DAYS = isExtraWideDevice()
                ? PADDING_LARGE
                : (getSafeWindowWidth() - totalDayOfWeekWidth) / 6;
            export const DATE_WIDTH = isExtraWideDevice()
                ? getWindowWidth() * 0.4 + PADDING_LARGE
                : DAY_OF_WEEK_WIDTH * 3 + GAP_BETWEEN_DAYS * 2;
        }

        export namespace TIME_OF_DAY {
            const totalWidth = getSafeWindowWidth() - (PADDING_LARGE / 3) * 4;
            export const TIME_OF_DAY_WIDTH = totalWidth / 4;
            export const GAP_BETWEEN_TIME_OF_DAY = (getSafeWindowWidth() - totalWidth) / 3;
        }

        export namespace DETAILS {
            export const DETAIL_WIDTH = REPEATING_SCHEDULE.DATE_WIDTH;
        }
    }
}
