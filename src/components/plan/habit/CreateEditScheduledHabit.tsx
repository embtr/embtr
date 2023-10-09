import { RouteProp, useRoute } from '@react-navigation/native';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
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
    const route = useRoute<RouteProp<RootStackParamList, 'CreateEditScheduledHabit'>>();

    const habitId = route.params.habitId;
    const plannedTaskId = route.params.plannedTaskId;
    const scheduledHabitId = route.params.scheduledHabitId;

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
                        <ScheduleHabitRepeatingSchedule />
                        <ScheduledHabitTimeOfDay />
                        <ScheduledHabitDetails />
                        <View style={{ height: TIMELINE_CARD_PADDING }} />
                    </View>
                </ScrollView>

                <ScheduledHabitSaveButton habitId={habitId ?? 0} />
            </Screen>
        </CreateEditScheduledHabitProvider>
    );
};
