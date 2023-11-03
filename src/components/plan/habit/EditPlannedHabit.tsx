import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { View, Animated, Easing } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ScheduleHabitDescription } from 'src/components/plan/habit/ScheduleHabitDescription';
import {
    CreateEditHabitMode,
    CreateEditScheduledHabitProvider,
} from 'src/contexts/habit/CreateEditScheduledHabitContext';
import { ScheduledHabitTitle } from 'src/components/plan/habit/ScheduledHabitTitle';
import { ScheduledHabitDetails } from 'src/components/plan/habit/ScheduledHabitDetails';
import { CreateEditHabitSaveButton } from 'src/components/plan/habit/CreateEditHabitSaveButton';
import SafeAreaView from 'react-native-safe-area-view';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ArchiveScheduledHabitModal } from './ArchiveScheduledHabitModal';
import { ScheduledHabitTimeOfDay } from './ScheduledHabitTimeOfDay';

export const runCreateEditScheduledHabitAnimation = (
    expand: boolean,
    viewHeight: Animated.Value,
    maxHeight: number = 50
) => {
    const height = expand ? maxHeight : 0;

    Animated.timing(viewHeight, {
        toValue: height, // Set the desired height
        duration: 125, // Adjust the duration as needed
        easing: Easing.ease, // Adjust the easing function as needed
        useNativeDriver: false, // Make sure to set this to false for height animation
    }).start();
};

export const EditPlannedHabit = () => {
    const { colors } = useTheme();
    const route = useRoute<RouteProp<RootStackParamList, 'EditPlannedHabit'>>();

    const newPlannedHabitData = route.params.newPlannedHabitData; // we are editing a planned habit that hasn't been saved yet
    const plannedTaskId = route.params.plannedTaskId; // editing a planned habit

    const editMode = plannedTaskId
        ? CreateEditHabitMode.EDIT_EXISTING_PLANNED_HABIT
        : newPlannedHabitData
        ? CreateEditHabitMode.CREATE_NEW_PLANNED_HABIT
        : CreateEditHabitMode.INVALID;

    const [archiveModalVisible, setArchiveModalVisible] = React.useState(false);

    const isCreatingNewPlannedHabit = editMode === CreateEditHabitMode.CREATE_NEW_PLANNED_HABIT;

    return (
        <CreateEditScheduledHabitProvider
            plannedTaskId={plannedTaskId}
            newPlannedHabitData={newPlannedHabitData}
        >
            <Screen>
                {!isCreatingNewPlannedHabit && (
                    <ArchiveScheduledHabitModal
                        visible={archiveModalVisible}
                        onDismiss={() => {
                            setArchiveModalVisible(!archiveModalVisible);
                        }}
                    />
                )}

                <SafeAreaView forceInset={{}} style={{ flex: 1 }}>
                    {/* <LoadingOverlay active={loading} /> */}

                    <Banner
                        name={'Edit Habit'}
                        leftRoute={'BACK'}
                        leftIcon={'arrow-back'}
                        rightText={!isCreatingNewPlannedHabit ? 'archive' : undefined}
                        rightColor={colors.archive}
                        rightOnClick={
                            !isCreatingNewPlannedHabit
                                ? () => {
                                      setArchiveModalVisible(true);
                                  }
                                : undefined
                        }
                    />

                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <View
                            style={{
                                flex: 1,
                                paddingHorizontal: TIMELINE_CARD_PADDING,
                            }}
                        >
                            <View style={{ height: TIMELINE_CARD_PADDING }} />
                            <ScheduledHabitTitle />
                            <ScheduleHabitDescription />
                            <ScheduledHabitTimeOfDay />
                            <ScheduledHabitDetails />
                        </View>
                        <View style={{ height: 10 * TIMELINE_CARD_PADDING }} />
                    </ScrollView>

                    <CreateEditHabitSaveButton
                        plannedHabitId={plannedTaskId}
                        newPlannedHabitData={newPlannedHabitData}
                    />
                </SafeAreaView>
            </Screen>
        </CreateEditScheduledHabitProvider>
    );
};
