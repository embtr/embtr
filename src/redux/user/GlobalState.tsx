import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/redux/store";
import { EmbtrMenuOption, EmbtrMenuOptions } from 'src/components/common/menu/EmbtrMenuOption';


const INITIAL_STATE: GlobalState = {
    accessLevel: "invalid",
    userProfileUrl: "",
    menuOptions: { uniqueIdentifier: "invalid", options: [] },
    test: "tester",
    openMenu: () => { },
    closeMenu: () => { }
};

export interface GlobalState {
    accessLevel: string,
    userProfileUrl: string,
    menuOptions: EmbtrMenuOptions,
    openMenu: Function,
    closeMenu: Function,
    test: string
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
        },
        setMenuOptions(state, action) {
            state.menuOptions = action.payload
        },
        setOpenMenu(state, action) {
            state.openMenu = action.payload
        },
        setCloseMenu(state, action) {
            state.closeMenu = action.payload
        }
    }
});

export const getAccessLevel = (state: RootState): string => {
    return state.globalState.accessLevel
};

export const getUserProfileUrl = (state: RootState): string => {
    return state.globalState.userProfileUrl
};

export const getMenuOptions = (state: RootState): EmbtrMenuOptions => {
    return state.globalState.menuOptions
}

export const getOpenMenu = (state: RootState): Function => {
    return state.globalState.openMenu
}

export const getCloseMenu = (state: RootState): Function => {
    return state.globalState.closeMenu
}

export const { setAccessLevel, setUserProfileUrl, setMenuOptions, setOpenMenu, setCloseMenu } = GlobalState.actions;
export default GlobalState.reducer;