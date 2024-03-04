import React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { View, Text, Pressable } from 'react-native';
import { CARD_SHADOW, PADDING_LARGE, PADDING_SMALL, POPPINS_REGULAR } from 'src/util/constants';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { Routes } from 'src/navigation/RootStackParamList';
import { useTheme } from '../theme/ThemeProvider';
import {
    ScheduledHabitController,
    ScheduledHabitCustomHooks,
} from 'src/controller/habit/ScheduledHabitController';
import { ScheduledHabit } from 'resources/schema';
import { HabitSummaryDetailsElement } from './HabitSummaryDetailsElement';
import { ManageHabitsTimePeriodButton } from './ManageHabitsTimePeriodButton';

const keyExtractor = (item: ScheduledHabit, index: number) => {
    return item.id ? item.id.toString() : '';
};

const buttonBackgroundColor = '#404040';
const opaqueButtonBackgroundColor = 'rgba(64, 64, 64, 0.4)';

export const ManageHabits = () => {
    const navigation = useEmbtrNavigation();
    const colors = useTheme().colors;

    const pastScheduledHabits = ScheduledHabitCustomHooks.usePast();
    const activeScheduledHabits = ScheduledHabitCustomHooks.useActive();
    const futureScheduledHabits = ScheduledHabitCustomHooks.useFuture();

    const [displayedTimePeriod, setDisplayedTimePeriod] = React.useState('active');

    const displayedScheduledHabits =
        displayedTimePeriod === 'active'
            ? activeScheduledHabits
            : displayedTimePeriod === 'past'
              ? pastScheduledHabits
              : futureScheduledHabits;

    const invalidateAll = () => {
        ScheduledHabitController.invalidateActiveScheduledHabits();
        ScheduledHabitController.invalidatePastScheduledHabits();
        ScheduledHabitController.invalidateFutureScheduledHabits();
    };

    const renderItem = ({ item, index }: { item: ScheduledHabit; index: number }) => {
        const isLastElement = index === (displayedScheduledHabits.data?.length ?? 1) - 1;

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

                            invalidateAll();
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

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    paddingHorizontal: PADDING_LARGE,
                    paddingBottom: PADDING_LARGE,
                }}
            >
                <View>
                    <ManageHabitsTimePeriodButton
                        name="Past"
                        key="past"
                        isSelected={displayedTimePeriod === 'past'}
                        onPress={() => {
                            setDisplayedTimePeriod('past');
                        }}
                    />
                </View>

                <View style={{ paddingLeft: PADDING_SMALL }}>
                    <ManageHabitsTimePeriodButton
                        name="Active"
                        key="active"
                        isSelected={displayedTimePeriod === 'active'}
                        onPress={() => {
                            setDisplayedTimePeriod('active');
                        }}
                    />
                </View>

                <View style={{ paddingLeft: PADDING_SMALL }}>
                    <ManageHabitsTimePeriodButton
                        name="Future"
                        key="future"
                        isSelected={displayedTimePeriod === 'future'}
                        onPress={() => {
                            setDisplayedTimePeriod('future');
                        }}
                    />
                </View>
            </View>

            <View style={{ flex: 1 }}>
                <FlatList
                    data={displayedScheduledHabits.data ?? []}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                />
            </View>

            <TouchableOpacity
                onPress={() => {
                    navigation.navigate(Routes.CREATE_EDIT_SCHEDULED_HABIT, {
                        isCreateCustomHabit: true,
                        onExit: () => {
                            invalidateAll();
                        },
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
