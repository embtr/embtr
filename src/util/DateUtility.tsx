import { addMinutes, differenceInDays, differenceInWeeks, format } from 'date-fns';
import { PureDate } from 'resources/types/date/PureDate';
import {
    daysOfWeek,
    daysOfWeekAbbreviated,
    humanDates,
    monthsAbbreviated,
} from 'src/util/DateConsts';

export const getDaysOld = (then: any, now: any): number => {
    const dateDiff = now - then;

    const daysOld = dateDiff / (1000 * 60 * 60 * 24);
    if (daysOld < 1) {
        return 0;
    }

    return Math.round(daysOld);
};

export const getTodayPureDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pureDate = getDateFormatted(today);
    return pureDate;
};

export const getYesterday = () => {
    return getDateMinusDays(new Date(), 1);
};

export const getDateMinusDays = (date: Date, days: number): Date => {
    date.setDate(date.getDate() - days);
    return date;
};

export const formatDate = (date: Date): string => {
    const formatted = format(addMinutes(date, date.getTimezoneOffset()), 'MMM dd, yyyy');
    return formatted;
};

export const getDatePrettyFullMonth = (date: Date): string => {
    const formatted = format(addMinutes(date, date.getTimezoneOffset()), 'MMMM dd');
    return formatted;
};

export const getDatePretty = (date: Date): string => {
    return format(date, 'MMM dd');
};

export const formatUtcDate = (date: Date) => {
    const month = monthsAbbreviated[date.getUTCMonth()];
    const day = date.getUTCDate();

    return `${month} ${day}`;
};

export const getTimePretty = (date: Date): string => {
    return format(date, 'h:mm aaa');
};

export const getDatePrettyWithTime = (date: Date): string => {
    let datePretty = getDatePretty(date);
    datePretty = datePretty + ', ' + getTimePretty(date);

    return datePretty;
};

export const getDateFormatted = (date: Date) => {
    let month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
};

export const getMonthDayFormatted = (date: Date) => {
    let month = '' + (date.getMonth() + 1),
        day = '' + date.getDate();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [month, day].join('/');
};

export const getDurationPretty = (duration: number): string => {
    let durationString = '';
    if (duration > 59) {
        durationString += Math.floor(duration / 60) + 'h ';
    }

    if (duration) {
        durationString += (duration % 60) + 'm';
    }

    return durationString;
};

export const getTimeLeft = (endDate: Date) => {
    const endDay = endDate ? new Date(endDate) : new Date();
    const daysLeft = differenceInDays(endDay, new Date());

    if (daysLeft > 13) {
        const weeksLeft = differenceInWeeks(endDay, new Date());
        return `${weeksLeft} weeks left`;
    }

    return `${daysLeft} days left`;
};

export function hydrateDates<T>(data: T): T {
    if (Array.isArray(data)) {
        return data.map((item) => hydrateDates(item)) as any;
    } else if (typeof data === 'object' && data !== null) {
        for (const key in data) {
            // do not convert these
            if (key === 'selectedDayKey' || key === 'dayKey') {
                continue;
            }

            if (typeof data[key] === 'string' && isDateString(data[key])) {
                (data as any)[key] = new Date(data[key] as string) as any;
            } else if (isPureDate(data[key])) {
                (data as any)[key] = PureDate.fromString(
                    (data as any)[key]['year'] +
                        '-' +
                        (data as any)[key]['month'] +
                        '-' +
                        (data as any)[key]['day']
                );
            } else {
                (data as any)[key] = hydrateDates((data as any)[key]) as any;
            }
        }
    }
    return data;
}

function isDateString(value: any): boolean {
    // Use a regular expression to check if the string matches the format of a date string
    const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2}))?$/;
    return dateRegex.test(value);
}

function isPureDate(value: any): boolean {
    if (value && value['year'] && value['month'] && value['day']) {
        return true;
    }

    return false;
}

export function getHumanReadableDate(d: Date): string {
    // Ensure we're getting a date object
    d = new Date(d);
    const now = new Date();

    // Check if date is today
    if (d.toDateString() === now.toDateString()) {
        // Check if the time is now
        if (d.getHours() === now.getHours()) {
            return humanDates.now;
        }
        return humanDates.today;
    } else if (d.toDateString() === getDateMinusDays(now, 1).toDateString()) {
        return humanDates.yesterday;
    } else if (differenceInDays(now, d) < 7) {
        return daysOfWeek[d.getDay()];
    } else {
        return `${daysOfWeekAbbreviated[d.getDay()]}. ${d.getDate()}. ${
            monthsAbbreviated[d.getMonth()]
        }.`;
    }
}
