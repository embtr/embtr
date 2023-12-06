export interface MonthPickerElementData {
    monthString: string;
    month: number;
    year: number;
    index: number;
}

export const getMonthData = (): MonthPickerElementData[] => {
    const now = new Date();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    const months: MonthPickerElementData[] = [];
    for (let i = 0; i < 13; i++) {
        const currentMonth = sixMonthsAgo.getMonth();
        const currentYear = sixMonthsAgo.getFullYear();
        const month = {
            monthString: MONTHS[sixMonthsAgo.getMonth()],
            month: currentMonth,
            year: currentYear,
            index: i,
        };
        months.push(month);

        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() + 1);
    }

    return months;
};

const MONTHS: {
    [key: number]: string;
} = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December',
};

export interface DayPickerElementData {
    day: string;
    displayNumber: number;
    index: number;
}
