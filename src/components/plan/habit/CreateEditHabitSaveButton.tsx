import { Keyboard, Text, TouchableOpacity, View } from 'react-native';
import { HabitController } from 'src/controller/habit/HabitController';
import { POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { PlannedTask, ScheduledHabit } from 'resources/schema';
import PlannedTaskController from 'src/controller/planning/PlannedTaskController';

interface Props {
    habitId?: number;
    scheduledHabitId?: number;
    plannedHabitId?: number;
}

export const CreateEditHabitSaveButton = ({ habitId, scheduledHabitId, plannedHabitId }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const {
        title,
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
        const plannedTask: PlannedTask = createUpdatedPlannedTask(plannedHabitId);
        await PlannedTaskController.update(plannedTask);
    };

    const onCreate = async () => {
        await handleCreateOrUpdate(createScheduledHabitRequest(scheduledHabitId, habitId));
    };

    const handleCreateOrUpdate = async (scheduledHabit: ScheduledHabit) => {
        Keyboard.dismiss();

        await HabitController.createOrUpdateScheduledHabit(scheduledHabit);
        navigation.popToTop();
    };

    const createUpdatedPlannedTask = (id?: number) => {
        const plannedTask: PlannedTask = {
            id: id,
            scheduledHabitId: scheduledHabitId,
            title: title,
            description: description,
            timeOfDay: timesOfDay.length > 0 ? timesOfDay[0] : undefined,
            quantity: quantity,
            unit: unit,
        };

        return plannedTask;
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

    const isUpdate = !!scheduledHabitId || !!plannedHabitId;

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
