import { differenceInDays, differenceInMonths, differenceInWeeks, format } from 'date-fns';

export const getDaysOld = (then: any, now: any): number => {
    const dateDiff = now - then;

    const daysOld = dateDiff / (1000 * 60 * 60 * 24);
    if (daysOld < 1) {
        return 0;
    }

    return Math.round(daysOld);
};

export const getYesterday = () => {
    return getDateMinusDays(new Date(), 1);
};

export const getDateMinusDays = (date: Date, days: number): Date => {
    date.setDate(date.getDate() - days);
    return date;
};

export const formatDate = (date: Date): string => {
    return format(date, 'MMM dd, yyyy');
};

export const getDatePretty = (date: Date): string => {
    const daysOld = getDaysOld(date, new Date());

    return format(date, 'MMMM dd, yyyy');
};

export const getTimePretty = (date: Date): string => {
    return format(date, 'h:mm aaa');
};

export const getDatePrettyWithTime = (date: Date): string => {
    let datePretty = getDatePretty(date);
    datePretty = datePretty + ' at ' + getTimePretty(date);

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
