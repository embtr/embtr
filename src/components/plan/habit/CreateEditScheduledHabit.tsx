import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { View, Animated, Easing } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ScheduleHabitDescription } from 'src/components/plan/habit/ScheduleHabitDescription';
import { ScheduleHabitRepeatingSchedule } from 'src/components/plan/habit/ScheduledHabitRepeatingSchedule';
import { CreateEditScheduledHabitProvider } from 'src/contexts/habit/CreateEditScheduledHabitContext';
import { ScheduledHabitTitle } from 'src/components/plan/habit/ScheduledHabitTitle';
import { ScheduledHabitTimeOfDay } from 'src/components/plan/habit/ScheduledHabitTimeOfDay';
import { ScheduledHabitDetails } from 'src/components/plan/habit/ScheduledHabitDetails';
import { ScheduledHabitSaveButton } from 'src/components/plan/habit/ScheduledHabitSaveButton';
import SafeAreaView from 'react-native-safe-area-view';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ArchiveScheduledHabitModal } from './ArchiveScheduledHabitModal';

// 600 lines? Thems rookie numbers - TheCaptainCoder - 2023-10-06

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

export const CreateEditScheduledHabit = () => {
    const { colors } = useTheme();
    const route = useRoute<RouteProp<RootStackParamList, 'CreateEditScheduledHabit'>>();

    const habitId = route.params.habitId;
    const plannedTaskId = route.params.plannedTaskId;
    const scheduledHabitId = route.params.scheduledHabitId;

    const [archiveModalVisible, setArchiveModalVisible] = React.useState(false);

    return (
        <CreateEditScheduledHabitProvider
            habitId={habitId}
            scheduledHabitId={scheduledHabitId}
            plannedTaskId={plannedTaskId}
        >
            <ArchiveScheduledHabitModal
                visible={archiveModalVisible}
                onDismiss={() => {
                    setArchiveModalVisible(!archiveModalVisible);
                }}
            />

            <Screen>
                <SafeAreaView forceInset={{}} style={{ flex: 1 }}>
                    {/* <LoadingOverlay active={loading} /> */}

                    <Banner
                        name={'Schedule Habit'}
                        leftRoute={'BACK'}
                        leftIcon={'arrow-back'}
                        rightText={'archive'}
                        rightColor={colors.archive}
                        rightOnClick={() => {
                            setArchiveModalVisible(true);
                        }}
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
                            <ScheduleHabitRepeatingSchedule />
                            <ScheduledHabitTimeOfDay />
                            <ScheduledHabitDetails />
                        </View>
                        <View style={{ height: 10 * TIMELINE_CARD_PADDING }} />
                    </ScrollView>

                    <ScheduledHabitSaveButton
                        habitId={habitId}
                        scheduledHabitId={scheduledHabitId}
                        plannedTaskId={plannedTaskId}
                    />
                </SafeAreaView>
            </Screen>
        </CreateEditScheduledHabitProvider>
    );
};
