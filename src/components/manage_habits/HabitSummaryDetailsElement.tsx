import { View, Text, Image } from 'react-native';
import { ScheduledHabit } from 'resources/schema';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { formatDate } from 'src/util/DateUtility';
import { TimeOfDayUtility } from 'src/util/time_of_day/TimeOfDayUtility';
import { TimesOfDayCustomHooks } from 'src/controller/time_of_day/TimeOfDayController';

interface Props {
    scheduledHabit: ScheduledHabit;
}

export const HabitSummaryDetailsElement = ({ scheduledHabit }: Props) => {
    const colors = useTheme().colors;

    const timeOfDays = TimesOfDayCustomHooks.useTimesOfDay();

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
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            width: '100%',
                        }}
                    >
                        {[
                            'SUNDAY',
                            'MONDAY',
                            'TUESDAY',
                            'WEDNESDAY',
                            'THURSDAY',
                            'FRIDAY',
                            'SATURDAY',
                        ].map((dayOfWeek) => {
                            const isDayOfWeekSelected = scheduledHabit.daysOfWeek?.some(
                                (selectedDayOfWeek) => {
                                    return selectedDayOfWeek.day === dayOfWeek;
                                }
                            );
                            return (
                                <Text
                                    style={{
                                        paddingRight: TIMELINE_CARD_PADDING / 2,
                                        fontFamily: POPPINS_REGULAR,
                                        fontSize: 18,
                                        color: isDayOfWeekSelected
                                            ? colors.accent_color
                                            : colors.secondary_text,
                                    }}
                                >
                                    {dayOfWeek.charAt(0)}
                                    {dayOfWeek.substring(1, 3).toLocaleLowerCase()}
                                </Text>
                            );
                        })}
                    </View>

                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            paddingTop: TIMELINE_CARD_PADDING / 2,
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
                                        height: 40,
                                        width: 40,
                                        opacity: timeOfDayIsSelected ? undefined : 0.2,
                                    }}
                                />
                            );
                        })}
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <View style={{ flex: 1, paddingTop: TIMELINE_CARD_PADDING / 2 }}>
                            <Text
                                style={{
                                    fontFamily: POPPINS_REGULAR,
                                    fontSize: 14,
                                    textAlign: 'center',
                                    color: colors.text,
                                }}
                            >
                                Starts: {start}
                            </Text>
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontFamily: POPPINS_REGULAR,
                                    fontSize: 14,
                                    textAlign: 'center',
                                    color: colors.text,
                                }}
                            >
                                Ends: {end}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};
