import React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { View, Text, Pressable } from 'react-native';
import { PADDING_LARGE, PADDING_SMALL, POPPINS_REGULAR } from 'src/util/constants';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { Routes } from 'src/navigation/RootStackParamList';
import { useTheme } from '../theme/ThemeProvider';
import {
    ScheduledHabitController,
    ScheduledHabitCustomHooks,
} from 'src/controller/habit/ScheduledHabitController';
import { ScheduledHabit } from 'resources/schema';
import { HabitSummaryDetailsElement } from './HabitSummaryDetailsElement';

const keyExtractor = (item: ScheduledHabit, index: number) => {
    return item.id ? item.id.toString() : '';
};

export const ManageHabits = () => {
    const navigation = useEmbtrNavigation();
    const colors = useTheme().colors;
    const activeScheduledHabits = ScheduledHabitCustomHooks.useActive();

    const renderItem = ({ item, index }: { item: ScheduledHabit; index: number }) => {
        const isLastElement = index === (activeScheduledHabits.data?.length ?? 1) - 1;

        return (
            <Pressable
                style={{
                    marginBottom: isLastElement ? PADDING_LARGE : 0,
                }}
                onPress={() => {
                    if (!item.id) {
                        return;
                    }

                    navigation.navigate(Routes.CREATE_EDIT_SCHEDULED_HABIT, {
                        scheduledHabitId: item.id,
                        onExit: () => {
                            if (!item.id) {
                                return;
                            }

                            ScheduledHabitController.invalidateScheduledHabitsByHabit(item.id);
                        },
                    });
                }}
            >
                <HabitSummaryDetailsElement scheduledHabit={item} />
            </Pressable>
        );
    };

    return (
        <Screen>
            <Banner
                name={'My Habits'}
                leftText={'close'}
                leftOnClick={() => {
                    navigation.goBack();
                }}
            />

            <View style={{ flex: 1 }}>
                <FlatList
                    data={activeScheduledHabits.data ?? []}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                />
            </View>

            <TouchableOpacity
                onPress={() => {
                    navigation.navigate(Routes.CREATE_EDIT_SCHEDULED_HABIT, {
                        isCreateCustomHabit: true,
                    });
                }}
            >
                <View
                    style={{
                        height: 50 - PADDING_LARGE,
                        marginHorizontal: PADDING_LARGE,
                        marginTop: PADDING_LARGE,
                        backgroundColor: colors.accent_color,
                        justifyContent: 'center',
                        borderRadius: 3,
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
                        Add New Habit
                    </Text>
                </View>
            </TouchableOpacity>
            <View style={{ height: PADDING_LARGE * 2 }} />
        </Screen>
    );
};
