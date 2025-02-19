import { PlannedTask } from 'resources/schema';

export interface UpdateModalPlannedTask {
    plannedTask: PlannedTask;
    dayKey: string;
    callback: Function;
}

export const DEFAULT_UPDATE_MODAL_PLANNED_TASK: UpdateModalPlannedTask = {
    plannedTask: {
        title: '',
        description: '',
        quantity: 0,
        completedQuantity: 0,
    },
    dayKey: '',
    callback: () => {},
};

export interface AppleAuthUserInfo {
    familyName?: string;
    givenName?: string;
    middleName?: string;
    namePrefix?: string;
    nameSuffix?: string;
    nickname?: string;
}

export const DEFAULT_APPLE_AUTH_USER_INFO: AppleAuthUserInfo = {};
