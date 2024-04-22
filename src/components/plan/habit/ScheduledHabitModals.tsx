import React from 'react';
import { View } from 'react-native';
import { ScheduledHabitController } from 'src/controller/habit/ScheduledHabitController';
import PlannedDayController, { getTodayKey } from 'src/controller/planning/PlannedDayController';
import { useDispatch } from 'react-redux';
import { getCurrentUser, getSelectedDayKey, setGlobalLoading } from 'src/redux/user/GlobalState';
import { useAppSelector } from 'src/redux/Hooks';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { ArchiveScheduledHabitModalImproved } from './ArchiveScheduledHabitModalImproved';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';
import { LeaveChallengeModalImproved } from './LeaveChallengeModal';

interface Props {
    scheduledHabitId?: number;
    isCreatedNewScheduledHabit: boolean;
    archiveModalVisible: boolean;
    leaveChallengeModalVisible: boolean;
    closeModals: () => void;
    onExit?: () => void;
}

export const ScheduledHabitModals = ({
    scheduledHabitId,
    isCreatedNewScheduledHabit,
    archiveModalVisible,
    leaveChallengeModalVisible,
    closeModals,
    onExit,
}: Props) => {
    const { isChallenge } = useCreateEditScheduleHabit();
    const currentUser = useAppSelector(getCurrentUser);
    const selectedDayKey = useAppSelector(getSelectedDayKey);
    const dispatch = useDispatch();
    const navigation = useEmbtrNavigation();

    if (isChallenge) {
        return (
            <LeaveChallengeModalImproved
                visible={leaveChallengeModalVisible}
                onDismiss={() => {
                    closeModals();
                }}
                onExit={() => {
                    closeModals();

                    requestAnimationFrame(() => {
                        navigation.goBack();
                    });
                }}
            />
        );
    }

    if (isCreatedNewScheduledHabit) {
        return (
            <ArchiveScheduledHabitModalImproved
                visible={archiveModalVisible}
                onArchive={async () => {
                    if (!scheduledHabitId) {
                        return;
                    }

                    closeModals();

                    dispatch(setGlobalLoading(true));
                    await ScheduledHabitController.archive(scheduledHabitId);
                    await PlannedDayController.invalidatePlannedDay(
                        currentUser.id ?? 0,
                        getTodayKey()
                    );
                    await PlannedDayController.invalidatePlannedDay(
                        currentUser.id ?? 0,
                        selectedDayKey
                    );

                    onExit?.();

                    dispatch(setGlobalLoading(false));
                    navigation.goBack();
                }}
                onDismiss={() => {
                    closeModals();
                }}
            />
        );
    }

    return <View />;
};
