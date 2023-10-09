import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { View, Animated, Easing } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { LoadingOverlay } from 'src/components/common/loading/LoadingOverlay';
import { ScheduleHabitDescription } from 'src/components/plan/habit/ScheduleHabitDescription';
import { ScheduleHabitRepeatingSchedule } from 'src/components/plan/habit/ScheduledHabitRepeatingSchedule';
import { CreateEditScheduledHabitProvider } from 'src/contexts/habit/CreateEditScheduledHabitContext';
import { ScheduledHabitTitle } from 'src/components/plan/habit/ScheduledHabitTitle';
import { ScheduledHabitTimeOfDay } from 'src/components/plan/habit/ScheduledHabitTimeOfDay';
import { ScheduledHabitDetails } from 'src/components/plan/habit/ScheduledHabitDetails';
import { ScheduledHabitSaveButton } from 'src/components/plan/habit/ScheduledHabitSaveButton';

// 600 lines? Thems rookie numbers - TheCaptainCoder - 2023-10-06

export const CreateEditScheduledHabit = () => {
    const { colors } = useTheme();
    const route = useRoute<RouteProp<RootStackParamList, 'CreateEditScheduledHabit'>>();

    const habitId = route.params.habitId;
    const plannedTaskId = route.params.plannedTaskId;
    const scheduledHabitId = route.params.scheduledHabitId;

    const toggleVisibility = (
        enabled: boolean,
        setEnabled: Function,
        viewHeight: Animated.Value,
        maxHeight: number = 50
    ) => {
        setEnabled(!enabled);
        const height = enabled ? 0 : maxHeight;

        Animated.timing(viewHeight, {
            toValue: height, // Set the desired height
            duration: 125, // Adjust the duration as needed
            easing: Easing.ease, // Adjust the easing function as needed
            useNativeDriver: false, // Make sure to set this to false for height animation
        }).start();
    };

    return (
        <CreateEditScheduledHabitProvider
            habitId={habitId}
            scheduledHabitId={scheduledHabitId}
            plannedTaskId={plannedTaskId}
        >
            <Screen>
                <LoadingOverlay active={false} />
                <Banner name={'Schedule Habit'} leftRoute={'BACK'} leftIcon={'arrow-back'} />

                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View
                        style={{
                            flex: 1,
                            paddingHorizontal: TIMELINE_CARD_PADDING,
                        }}
                    >
                        <ScheduledHabitTitle />
                        <ScheduleHabitDescription />
                        <ScheduleHabitRepeatingSchedule toggleVisibility={toggleVisibility} />
                        <ScheduledHabitTimeOfDay toggleVisibility={toggleVisibility} />
                        <ScheduledHabitDetails toggleVisibility={toggleVisibility} />
                        <View style={{ height: TIMELINE_CARD_PADDING }} />
                    </View>
                </ScrollView>

                <ScheduledHabitSaveButton habitId={habitId ?? 0} />
            </Screen>
        </CreateEditScheduledHabitProvider>
    );
};
