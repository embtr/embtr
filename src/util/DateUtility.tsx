export const getDaysOld = (then: any, now: any): number => {
    const dateDiff = now - then;

    const daysOld = dateDiff / (1000 * 60 * 60 * 24);
    if (daysOld < 1) {
        return 0;
    }

    return Math.round(daysOld);
};

export const getYesterday = () => {
    let date: Date = new Date();
    date.setDate(date.getDate() - 1);

    return date;
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
