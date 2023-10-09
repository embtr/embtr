import { Keyboard, Text, TouchableOpacity, View } from 'react-native';
import { CreateScheduledHabitRequest } from 'resources/types/requests/ScheduledHabitTypes';
import { HabitController } from 'src/controller/habit/HabitController';
import { POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import React from 'react';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/RootStackParamList';

interface Props {
    habitId: number;
}

export const ScheduledHabitSaveButton = ({ habitId }: Props) => {
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
                <TouchableOpacity
                    onPress={() => {
                        Keyboard.dismiss();
                        const createScheduledHabitRequest: CreateScheduledHabitRequest = {
                            taskId: Number(habitId),
                            description: description,
                        };

                        if (repeatingScheduleEnabled) {
                            createScheduledHabitRequest.daysOfWeekIds = daysOfWeek
                                .map((dayOfWeek) => dayOfWeek.id)
                                .filter((id) => id !== undefined) as number[];
                            createScheduledHabitRequest.startDate = startDate;
                            createScheduledHabitRequest.endDate = endDate;
                        }

                        if (detailsEnabled) {
                            createScheduledHabitRequest.quantity = quantity;
                            createScheduledHabitRequest.unitId = unit?.id ?? undefined;
                        }

                        if (timeOfDayEnabled) {
                            createScheduledHabitRequest.timesOfDayIds = timesOfDay
                                .map((timeOfDay) => timeOfDay.id)
                                .filter((id) => id !== undefined) as number[];
                        }

                        HabitController.createScheduledHabit(createScheduledHabitRequest);
                        navigation.popToTop();
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            color: colors.text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 16,
                        }}
                    >
                        Save
                    </Text>
                </TouchableOpacity>
            </View>
    );
};
