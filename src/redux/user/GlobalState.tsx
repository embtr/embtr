import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'src/redux/store';
import { EmbtrMenuOptions } from 'src/components/common/menu/EmbtrMenuOption';
import { PlannedTask, Unit, User } from 'resources/schema';
import { DEFAULT_UPDATE_MODAL_PLANNED_TASK, UpdateModalPlannedTask } from 'src/model/GlobalState';

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
    displayDropDownAlert: () => {},
    selectedDayKey: '2023-01-01',
    units: [],
    currentUser: {},
    timelineDays: 0,
    globalBlurBackground: false,
    showQuickAddModal: false,
    globalLoading: false,
    updateModalPlannedTask: DEFAULT_UPDATE_MODAL_PLANNED_TASK,
    removalModalPlannedTask: DEFAULT_UPDATE_MODAL_PLANNED_TASK,
    editModalPlannedTask: DEFAULT_UPDATE_MODAL_PLANNED_TASK,
};

interface GlobalState {
    menuOptions: EmbtrMenuOptions;
    openMenu: Function;
    closeMenu: Function;
    currentTab: string;
    userProfileImage: string;
    showCardShadow: boolean;
    cardRefreshRequests: string[];
    fireConfetti: Function;
    displayDropDownAlert: Function;
    selectedDayKey: string;
    units: Unit[];
    currentUser: User;
    timelineDays: number;
    globalBlurBackground: boolean;
    showQuickAddModal: boolean;
    globalLoading: boolean;
    updateModalPlannedTask: UpdateModalPlannedTask;
    removalModalPlannedTask: UpdateModalPlannedTask;
    editModalPlannedTask: UpdateModalPlannedTask;
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
        setDisplayDropDownAlert(state, action) {
            state.displayDropDownAlert = action.payload;
        },
        setSelectedDayKey(state, action) {
            console.log('setSelectedDayKey: ' + action.payload)
            state.selectedDayKey = action.payload;
        },
        setUnits(state, action) {
            state.units = action.payload;
        },
        setCurrentUser(state, action) {
            state.currentUser = action.payload;
        },
        setTimelineDays(state, action) {
            state.timelineDays = action.payload;
        },
        setGlobalBlurBackground(state, action) {
            state.globalBlurBackground = action.payload;
        },
        setShowQuickAddModal(state, action) {
            state.showQuickAddModal = action.payload;
        },
        setGlobalLoading(state, action) {
            state.globalLoading = action.payload;
        },
        resetToDefault(state) {
            state.currentUser = {};
            state.userProfileImage = '';
            state.selectedDayKey = '';
            state.globalLoading = false;
            state.updateModalPlannedTask = DEFAULT_UPDATE_MODAL_PLANNED_TASK;
            state.removalModalPlannedTask = DEFAULT_UPDATE_MODAL_PLANNED_TASK;
        },
        setUpdateModalPlannedTask(state, action) {
            state.updateModalPlannedTask = action.payload;
        },
        setRemovalModalPlannedTask(state, action) {
            state.removalModalPlannedTask = action.payload;
        },
        setEditModalPlannedTask(state, action) {
            state.editModalPlannedTask = action.payload;
        }
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

export const getDisplayDropDownAlert = (state: RootState): Function => {
    if (!state?.globalState.displayDropDownAlert) {
        return INITIAL_STATE.displayDropDownAlert;
    }

    return state.globalState.displayDropDownAlert;
};

export const getSelectedDayKey = (state: RootState): string => {
    if (!state?.globalState.selectedDayKey) {
        return INITIAL_STATE.selectedDayKey;
    }

    return state.globalState.selectedDayKey;
};

export const getUnits = (state: RootState): Unit[] => {
    if (!state?.globalState.units) {
        return INITIAL_STATE.units;
    }

    return state.globalState.units;
};

export const getCurrentUser = (state: RootState): User => {
    if (!state?.globalState.currentUser) {
        return INITIAL_STATE.currentUser;
    }

    return state.globalState.currentUser;
};

export const getTimelineDays = (state: RootState): number => {
    if (!state?.globalState.timelineDays) {
        return INITIAL_STATE.timelineDays;
    }

    return state.globalState.timelineDays;
};

export const getGlobalBlurBackground = (state: RootState): boolean => {
    if (state?.globalState.globalBlurBackground === undefined) {
        return INITIAL_STATE.globalBlurBackground;
    }

    return state.globalState.globalBlurBackground;
};

export const getShowQuickAddModal = (state: RootState): boolean => {
    if (state?.globalState.showQuickAddModal === undefined) {
        return INITIAL_STATE.showQuickAddModal;
    }

    return state.globalState.showQuickAddModal;
};

export const getGlobalLoading = (state: RootState): boolean => {
    if (state?.globalState.globalLoading === undefined) {
        return INITIAL_STATE.globalLoading;
    }

    return state.globalState.globalLoading;
};

export const getUpdateModalPlannedTask = (state: RootState): UpdateModalPlannedTask => {
    if (state?.globalState.updateModalPlannedTask === undefined) {
        return INITIAL_STATE.updateModalPlannedTask;
    }

    return state.globalState.updateModalPlannedTask;
};

export const getRemovalModalPlannedTask = (state: RootState): UpdateModalPlannedTask => {
    if (state?.globalState.removalModalPlannedTask === undefined) {
        return INITIAL_STATE.removalModalPlannedTask;
    }

    return state.globalState.removalModalPlannedTask;
};

export const getEditModalPlannedTask = (state: RootState): UpdateModalPlannedTask => {
    if (state?.globalState.editModalPlannedTask === undefined) {
        return INITIAL_STATE.editModalPlannedTask;
    }

    return state.globalState.editModalPlannedTask;
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
    setDisplayDropDownAlert,
    setSelectedDayKey,
    setUnits,
    setCurrentUser,
    setTimelineDays,
    setGlobalBlurBackground,
    setShowQuickAddModal,
    setGlobalLoading,
    resetToDefault,
    setUpdateModalPlannedTask,
    setRemovalModalPlannedTask,
    setEditModalPlannedTask,
} = GlobalState.actions;
