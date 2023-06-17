import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'src/redux/store';
import { EmbtrMenuOptions } from 'src/components/common/menu/EmbtrMenuOption';
import { Habit, PlannedDay, Unit } from 'resources/schema';

const INITIAL_STATE: GlobalState = {
    menuOptions: { uniqueIdentifier: 'invalid', options: [] },
    openMenu: () => {},
    closeMenu: () => {},
    currentTab: '',
    userProfileImage:
        'https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/common%2Fdefault_profile.png?alt=media&token=ff2e0e76-dc26-43f3-9354-9a14a240dcd6',
    showCardShadow: true,
    cardRefreshRequests: [],
    fireConfetti: () => {},
    todaysPlannedDay: {},
    currentlySelectedPlannedDay: {},
    units: [],
    habits: [],
};

export interface GlobalState {
    menuOptions: EmbtrMenuOptions;
    openMenu: Function;
    closeMenu: Function;
    currentTab: string;
    userProfileImage: string;
    showCardShadow: boolean;
    cardRefreshRequests: string[];
    fireConfetti: Function;
    todaysPlannedDay: PlannedDay;
    currentlySelectedPlannedDay: PlannedDay;
    units: Unit[];
    habits: Habit[];
}

const initialState: GlobalState = INITIAL_STATE;

export const GlobalState = createSlice({
    name: 'globalState',
    initialState,
    reducers: {
        setMenuOptions(state, action) {
            state.menuOptions = action.payload;
        },
        setOpenMenu(state, action) {
            state.openMenu = action.payload;
        },
        setCloseMenu(state, action) {
            state.closeMenu = action.payload;
        },
        setCurrentTab(state, action) {
            state.currentTab = action.payload;
        },
        setUserProfileImage(state, action) {
            state.userProfileImage = action.payload;
        },
        setShowCardShadow(state, action) {
            state.showCardShadow = action.payload;
        },
        addTimelineCardRefreshRequest(state, action) {
            let updatedTimelineCardRefreshRequests = state.cardRefreshRequests;
            if (!updatedTimelineCardRefreshRequests) {
                updatedTimelineCardRefreshRequests = [];
            }

            updatedTimelineCardRefreshRequests = updatedTimelineCardRefreshRequests.concat(
                action.payload
            );
            state.cardRefreshRequests = updatedTimelineCardRefreshRequests;
        },
        removeTimelineCardRefreshRequest(state, action) {
            state.cardRefreshRequests = state.cardRefreshRequests.filter(
                (item) => item !== action.payload
            );
        },
        setFireConfetti(state, action) {
            state.fireConfetti = action.payload;
        },
        setTodaysPlannedDay(state, action) {
            state.todaysPlannedDay = action.payload;

            if (state.currentlySelectedPlannedDay?.dayKey === state.todaysPlannedDay?.dayKey) {
                state.currentlySelectedPlannedDay = action.payload;
            }
        },
        setCurrentlySelectedPlannedDay(state, action) {
            state.currentlySelectedPlannedDay = action.payload;

            if (state.currentlySelectedPlannedDay?.dayKey === state.todaysPlannedDay?.dayKey) {
                state.todaysPlannedDay = action.payload;
            }
        },
        setUnits(state, action) {
            state.units = action.payload;
        },
        setHabits(state, action) {
            state.habits = action.payload;
        },
    },
});

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

export const getTimelineCardRefreshRequests = (state: RootState): string[] => {
    if (!state?.globalState.cardRefreshRequests) {
        return INITIAL_STATE.cardRefreshRequests;
    }

    return state.globalState.cardRefreshRequests;
};

export const getFireConfetti = (state: RootState): Function => {
    if (!state?.globalState.fireConfetti) {
        return INITIAL_STATE.fireConfetti;
    }

    return state.globalState.fireConfetti;
};

export const getTodaysPlannedDay = (state: RootState): PlannedDay => {
    if (!state?.globalState.todaysPlannedDay) {
        return INITIAL_STATE.todaysPlannedDay;
    }

    return state.globalState.todaysPlannedDay;
};

export const getCurrentlySelectedPlannedDay = (state: RootState): PlannedDay => {
    if (!state?.globalState.currentlySelectedPlannedDay) {
        return INITIAL_STATE.currentlySelectedPlannedDay;
    }

    return state.globalState.currentlySelectedPlannedDay;
};

export const getUnits = (state: RootState): Unit[] => {
    if (!state?.globalState.units) {
        return INITIAL_STATE.units;
    }

    return state.globalState.units;
};

export const getHabits = (state: RootState): Habit[] => {
    if (!state?.globalState.habits) {
        return INITIAL_STATE.habits;
    }

    return state.globalState.habits;
};

export const {
    setMenuOptions,
    setOpenMenu,
    setCloseMenu,
    setCurrentTab,
    setUserProfileImage,
    setShowCardShadow,
    addTimelineCardRefreshRequest,
    removeTimelineCardRefreshRequest,
    setFireConfetti,
    setTodaysPlannedDay,
    setCurrentlySelectedPlannedDay,
    setUnits,
    setHabits,
} = GlobalState.actions;
export default GlobalState.reducer;
