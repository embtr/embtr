import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'src/redux/store';
import { EmbtrMenuOptions } from 'src/components/common/menu/EmbtrMenuOption';

const INITIAL_STATE: GlobalState = {
    accessLevel: 'invalid',
    userProfileUrl: '',
    menuOptions: { uniqueIdentifier: 'invalid', options: [] },
    openMenu: () => {},
    closeMenu: () => {},
    selectedDayKey: 'invalid',
    currentTab: '',
    userProfileImage:
        'https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/common%2Fdefault_profile.png?alt=media&token=ff2e0e76-dc26-43f3-9354-9a14a240dcd6',
    showCardShadow: true,
};

export interface GlobalState {
    accessLevel: string;
    userProfileUrl: string;
    menuOptions: EmbtrMenuOptions;
    openMenu: Function;
    closeMenu: Function;
    selectedDayKey: string;
    currentTab: string;
    userProfileImage: string;
    showCardShadow: boolean;
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
        setCurrentTab(state, action) {
            state.currentTab = action.payload;
        },
        setUserProfileImage(state, action) {
            state.userProfileImage = action.payload;
        },
        setShowCardShadow(state, action) {
            console.log('settting shadow to', action.payload);
            state.showCardShadow = action.payload;
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

export const getCurrentTab = (state: RootState) => {
    if (!state?.globalState.currentTab) {
        return INITIAL_STATE.currentTab;
    }

    return state.globalState.currentTab;
};

export const getUserProfileImage = (state: RootState) => {
    if (!state?.globalState.userProfileImage) {
        return INITIAL_STATE.userProfileImage;
    }

    return state.globalState.userProfileImage;
};

export const getShowCardShadow = (state: RootState) => {
    if (!state?.globalState.showCardShadow === undefined) {
        return INITIAL_STATE.showCardShadow;
    }

    return state.globalState.showCardShadow;
};

export const {
    setAccessLevel,
    setUserProfileUrl,
    setMenuOptions,
    setOpenMenu,
    setCloseMenu,
    setSelectedDayKey,
    setCurrentTab,
    setUserProfileImage,
    setShowCardShadow,
} = GlobalState.actions;
export default GlobalState.reducer;
