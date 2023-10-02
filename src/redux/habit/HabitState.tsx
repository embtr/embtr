import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'src/redux/store';

const INITIAL_STATE: HabitState = {
    dayOfTheWeekWidth: 0,
    dayOfTheWeekGapWidth: 0,
};

export interface HabitState {
    dayOfTheWeekWidth: number;
    dayOfTheWeekGapWidth: number;

}

const initialState: HabitState = INITIAL_STATE;

export const HabitState = createSlice({
    name: 'habitState',
    initialState,
    reducers: {
        setDayOfTheWeekWidth(state, action) {
            state.dayOfTheWeekWidth = action.payload;
        },
        setDayOfTheWeekGapWidth(state, action) {
            state.dayOfTheWeekGapWidth = action.payload;
        },
    },
});

export const getDayOfTheWeekWidth = (state: RootState): number => {
    if (state.habitState.dayOfTheWeekWidth === undefined) {
        return INITIAL_STATE.dayOfTheWeekWidth;
    }

    return state.habitState.dayOfTheWeekWidth;
}

export const getDayOfTheWeekGapWidth = (state: RootState): number => {
    if (state.habitState.dayOfTheWeekGapWidth === undefined) {
        return INITIAL_STATE.dayOfTheWeekGapWidth;
    }

    return state.habitState.dayOfTheWeekGapWidth;
}

export const {
    setDayOfTheWeekWidth,
    setDayOfTheWeekGapWidth,
} = HabitState.actions;