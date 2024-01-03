import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScheduledHabit } from 'resources/schema';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { OptimalImage, OptimalImageData } from 'src/components/common/images/OptimalImage';
import { formatDate } from 'src/util/DateUtility';
import { TimeOfDayUtility } from 'src/util/time_of_day/TimeOfDayUtility';
import React from 'react';
import { TimesOfDayCustomHooks } from 'src/controller/time_of_day/TimeOfDayController';

interface Props {
    scheduledHabit: ScheduledHabit;
}

export const HabitSummaryDetailsElement = ({ scheduledHabit }: Props) => {
    const colors = useTheme().colors;

    const timeOfDays = TimesOfDayCustomHooks.useTimesOfDay();

    const optimalImageData: OptimalImageData = {
        localImage: scheduledHabit.task?.localImage,
        remoteImageUrl: scheduledHabit.task?.remoteImageUrl,
    };

    const start = formatDate(scheduledHabit.startDate ?? new Date());
    const end = formatDate(scheduledHabit.endDate ?? new Date());

    return (
        <View
            style={{
                width: '100%',
                paddingHorizontal: 12,
                paddingTop: 12,
                flexDirection: 'row',
            }}
        >
            <View
                style={[
                    {
                        backgroundColor: colors.card_background,
                        borderRadius: 9,
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 12,
                    },
                    CARD_SHADOW,
                ]}
            >
                <View style={{ alignItems: 'center', width: '100%' }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <View style={{ height: 40, width: 40 }}>
                            <OptimalImage
                                data={optimalImageData}
                                style={{ height: 40, width: 40 }}
                            />
                        </View>

                        <View
                            style={{
                                paddingLeft: TIMELINE_CARD_PADDING,
                                flex: 1,
                            }}
                        >
                            <Text
                                numberOfLines={1}
                                style={{
                                    color: colors.text,
                                    fontFamily: POPPINS_REGULAR,
                                    fontSize: 18,
                                }}
                            >
                                {scheduledHabit.task?.title}
                            </Text>
                            <View style={{ height: TIMELINE_CARD_PADDING / 2 }} />

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text
                                    numberOfLines={2}
                                    style={{
                                        color: colors.secondary_text,
                                        fontFamily: POPPINS_REGULAR,
                                        fontSize: 11,
                                    }}
                                >
                                    {scheduledHabit.description ??
                                        scheduledHabit.task?.description ??
                                        ''}
                                </Text>
                                <View style={{ flex: 1 }} />
                            </View>
                        </View>

                        <View>
                            <Ionicons
                                name={'chevron-forward-outline'}
                                size={18}
                                color={colors.secondary_text}
                            />
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingTop: TIMELINE_CARD_PADDING,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontFamily: POPPINS_REGULAR,
                                    fontSize: 14,
                                    textAlign: 'center',
                                    color: colors.text,
                                }}
                            >
                                Start: {start}
                            </Text>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                            {[
                                'SUNDAY',
                                'MONDAY',
                                'TUESDAY',
                                'WEDNESDAY',
                                'THURSDAY',
                                'FRIDAY',
                                'SATURDAY',
                            ].map((dayOfWeek) => {
                                console.log(scheduledHabit.daysOfWeek);
                                const isDayOfWeekSelected = scheduledHabit.daysOfWeek?.some(
                                    (selectedDayOfWeek) => {
                                        return selectedDayOfWeek.day === dayOfWeek;
                                    }
                                );
                                return (
                                    <Text
                                        style={{
                                            color: isDayOfWeekSelected
                                                ? colors.accent_color
                                                : colors.secondary_text,
                                        }}
                                    >
                                        {dayOfWeek.charAt(0)}
                                    </Text>
                                );
                            })}
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingTop: TIMELINE_CARD_PADDING,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontFamily: POPPINS_REGULAR,
                                    fontSize: 14,
                                    textAlign: 'center',
                                    color: colors.text,
                                }}
                            >
                                End: {end}
                            </Text>
                        </View>

                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}
                        >
                            {timeOfDays.map((timeOfDay) => {
                                const timeOfDayIsSelected = scheduledHabit.timesOfDay?.some(
                                    (selectedTimeOfDay) => {
                                        return selectedTimeOfDay.id === timeOfDay.id;
                                    }
                                );

                                return (
                                    <Image
                                        source={TimeOfDayUtility.getTimeOfDayIcon(timeOfDay)}
                                        style={{
                                            height: 20,
                                            width: 20,
                                            opacity: timeOfDayIsSelected ? 0.25 : undefined,
                                        }}
                                    />
                                );
                            })}
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};
