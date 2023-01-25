import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'src/redux/store';
import { EmbtrMenuOptions } from 'src/components/common/menu/EmbtrMenuOption';
import { FAKE_USER, UserModel } from 'src/controller/user/UserController';

const INITIAL_STATE: GlobalState = {
    accessLevel: 'invalid',
    userProfileUrl: '',
    currentUser: FAKE_USER,
    menuOptions: { uniqueIdentifier: 'invalid', options: [] },
    openMenu: () => {},
    closeMenu: () => {},
    selectedDayKey: 'invalid',
    timelineCardRefreshRequests: [],
};

export interface GlobalState {
    accessLevel: string;
    userProfileUrl: string;
    currentUser: UserModel;
    menuOptions: EmbtrMenuOptions;
    openMenu: Function;
    closeMenu: Function;
    selectedDayKey: string;
    timelineCardRefreshRequests: string[];
}

const initialState: GlobalState = INITIAL_STATE;

export const GlobalState = createSlice({
    name: 'globalState',
    initialState,
    reducers: {
        setAccessLevel(state, action) {
            state.accessLevel = action.payload;
        },
        setUserProfileUrl(state, action) {
            state.userProfileUrl = action.payload;
        },
        setCurrentUser(state, action) {
            state.currentUser = action.payload;
        },
        setMenuOptions(state, action) {
            state.menuOptions = action.payload;
        },
        setOpenMenu(state, action) {
            state.openMenu = action.payload;
        },
        setCloseMenu(state, action) {
            state.closeMenu = action.payload;
        },
        setSelectedDayKey(state, action) {
            state.selectedDayKey = action.payload;
        },
        addTimelineCardRefreshRequest(state, action) {
            let updatedTimelineCardRefreshRequests = state.timelineCardRefreshRequests;
            if (!updatedTimelineCardRefreshRequests) {
                updatedTimelineCardRefreshRequests = [];
            }

            updatedTimelineCardRefreshRequests = updatedTimelineCardRefreshRequests.concat(action.payload);
            state.timelineCardRefreshRequests = updatedTimelineCardRefreshRequests;
        },
        removeTimelineCardRefreshRequest(state, action) {
            state.timelineCardRefreshRequests = state.timelineCardRefreshRequests.filter((item) => item !== action.payload);
        },
    },
});

export const getAccessLevel = (state: RootState): string => {
    if (!state?.globalState?.accessLevel) {
        return INITIAL_STATE.accessLevel;
    }

    return state.globalState.accessLevel;
};

export const getUserProfileUrl = (state: RootState): string => {
    if (!state?.globalState?.userProfileUrl) {
        return INITIAL_STATE.userProfileUrl;
    }

    return state.globalState.userProfileUrl;
};

export const getCurrentUser = (state: RootState): UserModel => {
    if (!state?.globalState?.currentUser) {
        return INITIAL_STATE.currentUser;
    }

    return state.globalState.currentUser;
};

export const getMenuOptions = (state: RootState): EmbtrMenuOptions => {
    if (!state?.globalState?.menuOptions) {
        return INITIAL_STATE.menuOptions;
    }

    return state.globalState.menuOptions;
};

export const getOpenMenu = (state: RootState): Function => {
    if (!state?.globalState?.openMenu) {
        return INITIAL_STATE.openMenu;
    }

    return state.globalState.openMenu;
};

export const getCloseMenu = (state: RootState): Function => {
    if (!state?.globalState?.closeMenu) {
        return INITIAL_STATE.closeMenu;
    }

    return state.globalState.closeMenu;
};

export const getSelectedDayKey = (state: RootState): string => {
    if (!state?.globalState?.selectedDayKey) {
        return INITIAL_STATE.selectedDayKey;
    }

    return state.globalState.selectedDayKey;
};

export const getTimelineCardRefreshRequests = (state: RootState): string[] => {
    if (!state?.globalState.closeMenu) {
        return INITIAL_STATE.timelineCardRefreshRequests;
    }

    return state.globalState.timelineCardRefreshRequests;
};

export const {
    setAccessLevel,
    setUserProfileUrl,
    setCurrentUser,
    setMenuOptions,
    setOpenMenu,
    setCloseMenu,
    setSelectedDayKey,
    addTimelineCardRefreshRequest,
    removeTimelineCardRefreshRequest,
} = GlobalState.actions;
export default GlobalState.reducer;
