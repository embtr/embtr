import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/redux/Store";

const INITIAL_STATE: GlobalState = {
    accessLevel: "invalid",
    userProfileUrl: ""
};

export interface GlobalState {
    accessLevel: string,
    userProfileUrl: string
}

const initialState: GlobalState = INITIAL_STATE;

export const GlobalState = createSlice({
    name: "globalState",
    initialState,
    reducers: {
        setAccessLevel(state, action) {
            state.accessLevel = action.payload;
        },
        setUserProfileUrl(state, action) {
            state.userProfileUrl = action.payload
        }
    }
});

export const getAccessLevel = (state: RootState): string => {
    return state.globalState.accessLevel
};

export const getUserProfileUrl = (state: RootState): string => {
    return state.globalState.userProfileUrl
};

export const { setAccessLevel, setUserProfileUrl } = GlobalState.actions;
export default GlobalState.reducer;