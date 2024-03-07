import { View, Text, Image } from 'react-native';
import { ScheduledHabit } from 'resources/schema';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_REGULAR, PADDING_LARGE } from 'src/util/constants';
import { TimeOfDayUtility } from 'src/util/time_of_day/TimeOfDayUtility';

interface Props {
    scheduledHabit: ScheduledHabit;
}

export const ScheduledHabitConfiguration = () => {
    const colors = useTheme().colors;

    return (
        <View
            style={{
                width: '100%',
                paddingHorizontal: PADDING_LARGE,
                paddingTop: PADDING_LARGE,
            }}
        >
            <View
                style={[
                    {
                        backgroundColor: colors.card_background,
                        borderRadius: 9,
                        flex: 1,
                        alignItems: 'center',
                        padding: PADDING_LARGE,
                    },
                    CARD_SHADOW,
                ]}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <View
                            style={{
                                backgroundColor: '#404040',
                                borderRadius: 9,
                                height: 40,
                                width: 40,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <OptimalImage
                                data={optimalImageData}
                                style={{ height: 36, width: 36 }}
                            />
                        </View>
                    </View>
                    <Text
                        style={{
                            color: colors.text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 18,
                        }}
                    >
                        {title}
                    </Text>
                    <View style={{ flex: 1 }} />
                </View>

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
                                        paddingRight: PADDING_LARGE / 2,
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
                            alignItems: 'center',
                            flexDirection: 'row',
                        }}
                    >
                        {timeOfDays.map((timeOfDay) => {
                            if (timeOfDay.id === 5) {
                                return;
                            }

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

                    {/*
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingTop: PADDING_LARGE / 2,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                            }}
                        >
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
                    */}
                </View>
            </View>
        </View>
    );
};
