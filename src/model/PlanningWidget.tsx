export interface MonthPickerElementData {
    month: string;
    index: number;
}

export const MONTHS: Array<MonthPickerElementData> = [
    { month: 'January', index: 0 },
    { month: 'February', index: 1 },
    { month: 'March', index: 2 },
    { month: 'April', index: 3 },
    { month: 'May', index: 4 },
    { month: 'June', index: 5 },
    { month: 'July', index: 6 },
    { month: 'August', index: 7 },
    { month: 'September', index: 8 },
    { month: 'October', index: 9 },
    { month: 'November', index: 10 },
    { month: 'December', index: 11 },
];

export interface DayPickerElementData {
    day: string;
    index: number;
}