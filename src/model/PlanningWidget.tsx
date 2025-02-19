import { getDayKeyFromDate } from 'src/controller/planning/PlannedDayController';

export interface MonthPickerElementData {
    monthString: string;
    month: number;
    year: number;
    index: number;
}

export const getMonthData = (date: Date): MonthPickerElementData[] => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setMonth(date.getMonth() - 6);

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

export const generateDaysOfMonth = (month: MonthPickerElementData): DayPickerElementData[] => {
    const date = new Date(month.year, month.month, 1);
    const days: DayPickerElementData[] = [];
    while (date.getMonth() === month.month) {
        const dayData = DAYS[date.getDay()];

        const day: DayPickerElementData = {
            dayKey: getDayKeyFromDate(date),
            dayShort: dayData.dayShort,
            dayFull: dayData.dayFull,
            displayNumber: date.getDate(),
            index: date.getDate() - 1,
        };
        days.push(day);
        date.setDate(date.getDate() + 1);
    }

    // add placeholders until we have 31 days
    while (days.length < 31) {
        days.push({
            dayKey: '',
            dayShort: '',
            dayFull: '',
            displayNumber: 0,
            index: days.length,
        });
    }

    return days;
};

export const getDaysForMonth = () => {
    const daysOfMonthMap = new Map<string, DayPickerElementData[]>();
    daysOfMonthMap.set(
        '202300',
        generateDaysOfMonth({ year: 2023, month: 0, monthString: 'January', index: 0 })
    );
    daysOfMonthMap.set(
        '202301',
        generateDaysOfMonth({ year: 2023, month: 1, monthString: 'February', index: 1 })
    );
    daysOfMonthMap.set(
        '202302',
        generateDaysOfMonth({ year: 2023, month: 2, monthString: 'March', index: 2 })
    );
    daysOfMonthMap.set(
        '202303',
        generateDaysOfMonth({ year: 2023, month: 3, monthString: 'April', index: 3 })
    );
    daysOfMonthMap.set(
        '202304',
        generateDaysOfMonth({ year: 2023, month: 4, monthString: 'May', index: 4 })
    );
    daysOfMonthMap.set(
        '202305',
        generateDaysOfMonth({ year: 2023, month: 5, monthString: 'June', index: 5 })
    );
    daysOfMonthMap.set(
        '202306',
        generateDaysOfMonth({ year: 2023, month: 6, monthString: 'July', index: 6 })
    );
    daysOfMonthMap.set(
        '202307',
        generateDaysOfMonth({ year: 2023, month: 7, monthString: 'August', index: 7 })
    );
    daysOfMonthMap.set(
        '202308',
        generateDaysOfMonth({ year: 2023, month: 8, monthString: 'September', index: 8 })
    );
    daysOfMonthMap.set(
        '202309',
        generateDaysOfMonth({ year: 2023, month: 9, monthString: 'October', index: 9 })
    );
    daysOfMonthMap.set(
        '202310',
        generateDaysOfMonth({ year: 2023, month: 10, monthString: 'November', index: 10 })
    );
    daysOfMonthMap.set(
        '202311',
        generateDaysOfMonth({ year: 2023, month: 11, monthString: 'December', index: 11 })
    );
    daysOfMonthMap.set(
        '202400',
        generateDaysOfMonth({ year: 2024, month: 0, monthString: 'January', index: 0 })
    );
    daysOfMonthMap.set(
        '202401',
        generateDaysOfMonth({ year: 2024, month: 1, monthString: 'February', index: 1 })
    );
    daysOfMonthMap.set(
        '202402',
        generateDaysOfMonth({ year: 2024, month: 2, monthString: 'March', index: 2 })
    );
    daysOfMonthMap.set(
        '202403',
        generateDaysOfMonth({ year: 2024, month: 3, monthString: 'April', index: 3 })
    );
    daysOfMonthMap.set(
        '202404',
        generateDaysOfMonth({ year: 2024, month: 4, monthString: 'May', index: 4 })
    );
    daysOfMonthMap.set(
        '202405',
        generateDaysOfMonth({ year: 2024, month: 5, monthString: 'June', index: 5 })
    );
    daysOfMonthMap.set(
        '202406',
        generateDaysOfMonth({ year: 2024, month: 6, monthString: 'July', index: 6 })
    );
    daysOfMonthMap.set(
        '202407',
        generateDaysOfMonth({ year: 2024, month: 7, monthString: 'August', index: 7 })
    );
    daysOfMonthMap.set(
        '202408',
        generateDaysOfMonth({ year: 2024, month: 8, monthString: 'September', index: 8 })
    );
    daysOfMonthMap.set(
        '202409',
        generateDaysOfMonth({ year: 2024, month: 9, monthString: 'October', index: 9 })
    );
    daysOfMonthMap.set(
        '202410',
        generateDaysOfMonth({ year: 2024, month: 10, monthString: 'November', index: 10 })
    );
    daysOfMonthMap.set(
        '202411',
        generateDaysOfMonth({ year: 2024, month: 11, monthString: 'December', index: 11 })
    );
    daysOfMonthMap.set(
        '202500',
        generateDaysOfMonth({ year: 2025, month: 0, monthString: 'January', index: 0 })
    );
    daysOfMonthMap.set(
        '202501',
        generateDaysOfMonth({ year: 2025, month: 1, monthString: 'February', index: 1 })
    );
    daysOfMonthMap.set(
        '202502',
        generateDaysOfMonth({ year: 2025, month: 2, monthString: 'March', index: 2 })
    );
    daysOfMonthMap.set(
        '202503',
        generateDaysOfMonth({ year: 2025, month: 3, monthString: 'April', index: 3 })
    );
    daysOfMonthMap.set(
        '202504',
        generateDaysOfMonth({ year: 2025, month: 4, monthString: 'May', index: 4 })
    );
    daysOfMonthMap.set(
        '202505',
        generateDaysOfMonth({ year: 2025, month: 5, monthString: 'June', index: 5 })
    );
    daysOfMonthMap.set(
        '202506',
        generateDaysOfMonth({ year: 2025, month: 6, monthString: 'July', index: 6 })
    );
    daysOfMonthMap.set(
        '202507',
        generateDaysOfMonth({ year: 2025, month: 7, monthString: 'August', index: 7 })
    );
    daysOfMonthMap.set(
        '202508',
        generateDaysOfMonth({ year: 2025, month: 8, monthString: 'September', index: 8 })
    );
    daysOfMonthMap.set(
        '202509',
        generateDaysOfMonth({ year: 2025, month: 9, monthString: 'October', index: 9 })
    );
    daysOfMonthMap.set(
        '202510',
        generateDaysOfMonth({ year: 2025, month: 10, monthString: 'November', index: 10 })
    );
    daysOfMonthMap.set(
        '202511',
        generateDaysOfMonth({ year: 2025, month: 11, monthString: 'December', index: 11 })
    );

    return daysOfMonthMap;
};

interface DayData {
    dayShort: string;
    dayFull: string;
}

export const DAYS: DayData[] = [
    { dayShort: 'Sun', dayFull: 'Sunday' },
    { dayShort: 'Mon', dayFull: 'Monday' },
    { dayShort: 'Tue', dayFull: 'Tuesday' },
    { dayShort: 'Wed', dayFull: 'Wednesday' },
    { dayShort: 'Thu', dayFull: 'Thursday' },
    { dayShort: 'Fri', dayFull: 'Friday' },
    { dayShort: 'Sat', dayFull: 'Saturday' },
];

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
    dayKey: string;
    dayFull: string;
    dayShort: string;
    displayNumber: number;
    index: number;
}
