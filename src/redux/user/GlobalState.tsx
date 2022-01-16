import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/redux/Store";

const INITIAL_STATE: GlobalState = {
    accessLevel: "invalid"
};

export interface GlobalState {
    accessLevel: string
}

const initialState: GlobalState = INITIAL_STATE;

export const GlobalState = createSlice({
    name: "globalState",
    initialState,
    reducers: {
        setAccessLevel(state, action) {
            state.accessLevel = action.payload;
        }
    }
});

export const getAccessLevel = (state: RootState): string => {
    return state.globalState.accessLevel
};

export const { setAccessLevel } = GlobalState.actions;
export default GlobalState.reducer;