import { Keyboard, Text, TouchableOpacity, View } from 'react-native';
import { HabitController } from 'src/controller/habit/HabitController';
import { POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { ScheduledHabit } from 'resources/schema';

interface Props {
    habitId?: number;
    scheduledHabitId?: number;
    plannedTaskId?: number;
}

export const ScheduledHabitSaveButton = ({ habitId, scheduledHabitId, plannedTaskId }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const {
        description,
        daysOfWeek,
        quantity,
        unit,
        timeOfDayEnabled,
        repeatingScheduleEnabled,
        detailsEnabled,
        startDate,
        endDate,
        timesOfDay,
    } = useCreateEditScheduleHabit();

    const onUpdate = async () => {
        const scheduledHabit = createScheduledHabitRequest(scheduledHabitId, habitId);
        await handleCreateOrUpdate(scheduledHabit);
    };

    const onCreate = async () => {
        await handleCreateOrUpdate(createScheduledHabitRequest(scheduledHabitId, habitId));
    };

    const handleCreateOrUpdate = async (scheduledHabit: ScheduledHabit) => {
        Keyboard.dismiss();

        await HabitController.createOrUpdateScheduledHabit(scheduledHabit);
        navigation.popToTop();
    };

    const createScheduledHabitRequest = (id?: number, habitId?: number) => {
        const scheduledHabit: ScheduledHabit = {
            id: id,
            taskId: habitId,
            description: description,
        };

        if (repeatingScheduleEnabled) {
            scheduledHabit.daysOfWeek = daysOfWeek.map((day) => {
                return {
                    id: day.id,
                };
            });
            scheduledHabit.startDate = startDate;
            scheduledHabit.endDate = endDate;
        }

        if (detailsEnabled) {
            scheduledHabit.quantity = quantity;
            scheduledHabit.unitId = unit?.id ?? undefined;
        }

        if (timeOfDayEnabled) {
            scheduledHabit.timesOfDay = timesOfDay.map((timeOfDay) => {
                return {
                    id: timeOfDay.id,
                };
            });
        }

        return scheduledHabit;
    };

    const isUpdate = !!scheduledHabitId;

    return (
        <View
            style={{
                height: 50 - TIMELINE_CARD_PADDING,
                marginHorizontal: TIMELINE_CARD_PADDING / 2,
                backgroundColor: colors.accent_color,
                justifyContent: 'center',
                borderRadius: 3,
            }}
        >
            <TouchableOpacity onPress={isUpdate ? onUpdate : onCreate}>
                <Text
                    style={{
                        textAlign: 'center',
                        color: colors.text,
                        fontFamily: POPPINS_REGULAR,
                        fontSize: 16,
                    }}
                >
                    {isUpdate ? 'Update' : 'Create'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};
