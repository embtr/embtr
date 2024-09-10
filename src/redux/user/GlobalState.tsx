import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'src/redux/store';
import { EmbtrMenuOptions } from 'src/components/common/menu/EmbtrMenuOption';
import { User } from 'resources/schema';
import {
    AppleAuthUserInfo,
    DEFAULT_APPLE_AUTH_USER_INFO,
    DEFAULT_UPDATE_MODAL_PLANNED_TASK,
    UpdateModalPlannedTask,
} from 'src/model/GlobalState';
import { DayKey } from 'resources/types/custom_schema/DayKey';
import {
    INVALID_FLOW_STATE,
    TutorialIslandFlowState,
    TutorialIslandStepKey,
} from 'src/model/tutorial_island/TutorialIslandModels';
import { TutorialIslandInvalidFlow } from 'src/model/tutorial_island/flows/TutorialIslandInvalidFlow';
import { LevelDetails } from 'resources/types/dto/Level';

const INITIAL_STATE: GlobalState = {
    menuOptions: { uniqueIdentifier: 'invalid', options: [] },
    openMenu: () => { },
    closeMenu: () => { },
    currentTab: '',
    userProfileImage:
        'https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/common%2Fdefault_profile.png?alt=media&token=ff2e0e76-dc26-43f3-9354-9a14a240dcd6',
    showCardShadow: true,
    cardRefreshRequests: [],
    fireConfetti: () => {
        console.log('I SUCK');
    },
    firePoints: () => {
        console.log('I SUCK (ALSO)');
    },
    displayDropDownAlert: () => { },
    selectedDayKey: '',
    currentUser: {},
    timelineDays: 0,
    globalBlurBackground: false,
    showQuickAddModal: false,
    globalLoading: false,
    updateModalPlannedTask: DEFAULT_UPDATE_MODAL_PLANNED_TASK,
    removalModalPlannedTask: DEFAULT_UPDATE_MODAL_PLANNED_TASK,
    editModalPlannedTask: DEFAULT_UPDATE_MODAL_PLANNED_TASK,

    updateTutorialIslandModalPlannedTask: DEFAULT_UPDATE_MODAL_PLANNED_TASK,
    removalTutorialIslandModalPlannedTask: DEFAULT_UPDATE_MODAL_PLANNED_TASK,
    editTutorialIslandModalPlannedTask: DEFAULT_UPDATE_MODAL_PLANNED_TASK,
    acknowledgedVersion: '0.0.0',
    appleAuthUserInfo: DEFAULT_APPLE_AUTH_USER_INFO,
    tutorialIslandState: INVALID_FLOW_STATE,
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
    firePoints: Function;
    displayDropDownAlert: Function;
    selectedDayKey: DayKey;
    currentUser: User;
    timelineDays: number;
    globalBlurBackground: boolean;
    showQuickAddModal: boolean;
    globalLoading: boolean;
    updateModalPlannedTask: UpdateModalPlannedTask;
    removalModalPlannedTask: UpdateModalPlannedTask;
    editModalPlannedTask: UpdateModalPlannedTask;
    updateTutorialIslandModalPlannedTask: UpdateModalPlannedTask;
    removalTutorialIslandModalPlannedTask: UpdateModalPlannedTask;
    editTutorialIslandModalPlannedTask: UpdateModalPlannedTask;
    acknowledgedVersion: string;
    appleAuthUserInfo: AppleAuthUserInfo;
    tutorialIslandState: TutorialIslandFlowState;
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
        setFireConfetti(state, action) {
            state.fireConfetti = action.payload;
        },
        setFirePoints(state, action) {
            state.firePoints = action.payload;
        },
        setDisplayDropDownAlert(state, action) {
            state.displayDropDownAlert = action.payload;
        },
        setSelectedDayKey(state, action) {
            state.selectedDayKey = action.payload;
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
            state.globalBlurBackground = false;
            state.showQuickAddModal = false;
            state.appleAuthUserInfo = DEFAULT_APPLE_AUTH_USER_INFO;
            state.tutorialIslandState = {
                flow: TutorialIslandInvalidFlow,
                currentStepKey: TutorialIslandStepKey.INVALID,
            };
        },
        setUpdateModalPlannedTask(state, action: { payload: UpdateModalPlannedTask }) {
            state.updateModalPlannedTask = action.payload;
        },
        setRemovalModalPlannedTask(state, action) {
            state.removalModalPlannedTask = action.payload;
        },
        setEditModalPlannedTask(state, action) {
            state.editModalPlannedTask = action.payload;
        },
        setUpdateTutorialIslandModalPlannedTask(
            state,
            action: { payload: UpdateModalPlannedTask }
        ) {
            state.updateTutorialIslandModalPlannedTask = action.payload;
        },
        setRemovalTutorialIslandModalPlannedTask(state, action) {
            state.removalTutorialIslandModalPlannedTask = action.payload;
        },
        setEditTutorialIslandModalPlannedTask(state, action) {
            state.editTutorialIslandModalPlannedTask = action.payload;
        },
        setAcknowledgedVersion(state, action) {
            state.acknowledgedVersion = action.payload;
        },
        setAppleAuthUserInfo(state, action) {
            state.appleAuthUserInfo = action.payload;
        },
        setTutorialIslandState(state, action) {
            state.tutorialIslandState = action.payload;
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

export const getFireConfetti = (state: RootState): Function => {
    if (!state?.globalState.fireConfetti) {
        return INITIAL_STATE.fireConfetti;
    }

    return state.globalState.fireConfetti;
};

export const getFirePoints = (state: RootState): Function => {
    if (!state?.globalState.firePoints) {
        return INITIAL_STATE.firePoints;
    }

    return state.globalState.firePoints;
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

export const getUpdateTutorialIslandModalPlannedTask = (
    state: RootState
): UpdateModalPlannedTask => {
    if (state?.globalState.updateTutorialIslandModalPlannedTask === undefined) {
        return INITIAL_STATE.updateModalPlannedTask;
    }

    return state.globalState.updateTutorialIslandModalPlannedTask;
};

export const getRemovalTutorialIslandModalPlannedTask = (
    state: RootState
): UpdateModalPlannedTask => {
    if (state?.globalState.removalTutorialIslandModalPlannedTask === undefined) {
        return INITIAL_STATE.removalModalPlannedTask;
    }

    return state.globalState.removalTutorialIslandModalPlannedTask;
};

export const getEditTutorialIslandModalPlannedTask = (state: RootState): UpdateModalPlannedTask => {
    if (state?.globalState.editTutorialIslandModalPlannedTask === undefined) {
        return INITIAL_STATE.editModalPlannedTask;
    }

    return state.globalState.editTutorialIslandModalPlannedTask;
};

export const getAcknowledgedVersion = (state: RootState): string => {
    if (state?.globalState.acknowledgedVersion === undefined) {
        return INITIAL_STATE.acknowledgedVersion;
    }

    return state.globalState.acknowledgedVersion;
};

export const getAppleAuthUserInfo = (state: RootState): AppleAuthUserInfo => {
    if (state?.globalState.appleAuthUserInfo === undefined) {
        return INITIAL_STATE.appleAuthUserInfo;
    }

    return state.globalState.appleAuthUserInfo;
};

export const getTutorialIslandState = (state: RootState): TutorialIslandFlowState => {
    if (state?.globalState.tutorialIslandState === undefined) {
        return INITIAL_STATE.tutorialIslandState;
    }

    return state.globalState.tutorialIslandState;
};

export const {
    setMenuOptions,
    setOpenMenu,
    setCloseMenu,
    setCurrentTab,
    setUserProfileImage,
    setShowCardShadow,
    setFireConfetti,
    setFirePoints,
    setDisplayDropDownAlert,
    setSelectedDayKey,
    setCurrentUser,
    setTimelineDays,
    setGlobalBlurBackground,
    setShowQuickAddModal,
    setGlobalLoading,
    resetToDefault,
    setUpdateModalPlannedTask,
    setRemovalModalPlannedTask,
    setEditModalPlannedTask,
    setUpdateTutorialIslandModalPlannedTask,
    setRemovalTutorialIslandModalPlannedTask,
    setEditTutorialIslandModalPlannedTask,
    setAcknowledgedVersion,
    setAppleAuthUserInfo,
    setTutorialIslandState,
} = GlobalState.actions;
