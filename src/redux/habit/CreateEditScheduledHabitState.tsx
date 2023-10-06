import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'src/redux/store';

const INITIAL_STATE: CreateEditScheduledHabitState = {
    iconUrl: '',
    title: '',
    description: '',
};

export interface CreateEditScheduledHabitState {
    iconUrl: String;
    title: String;
    description: String;
}

export interface CreateEditScheduledHabitStates {

}

export const CreateEditScheduledHabitState = createSlice({
    name: 'createEditScheduledHabitStore',
    initialState: INITIAL_STATE,
    reducers: {
        setIconUrl(state, action) {
            state.iconUrl = action.payload;
        },
        setTitle(state, action) {
            state.title = action.payload;
        },
        setDescription(state, action) {
            state.description = action.payload;
        },
    },
});

export const getIconUrl = (state: RootState): String => {
    if (state.createEditScheduledHabitState.iconUrl === undefined) {
        return INITIAL_STATE.iconUrl;
    }

    return state.createEditScheduledHabitState.iconUrl;
};

export const getTitle = (state: RootState): String => {
    if (state.createEditScheduledHabitState.title === undefined) {
        return INITIAL_STATE.title;
    }

    return state.createEditScheduledHabitState.title;
};

export const getDescription = (state: RootState): String => {
    if (state.createEditScheduledHabitState.description === undefined) {
        return INITIAL_STATE.description;
    }

    return state.createEditScheduledHabitState.description;
};

export const { setIconUrl, setTitle, setDescription } = CreateEditScheduledHabitState.actions;
