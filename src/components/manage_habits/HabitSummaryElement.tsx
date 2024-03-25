import { Text, View, Image } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_REGULAR, PADDING_LARGE, PADDING_SMALL } from 'src/util/constants';
import { OptimalImage } from 'src/components/common/images/OptimalImage';
import { ScheduledHabit } from 'resources/schema';
import { TimesOfDayCustomHooks } from 'src/controller/time_of_day/TimeOfDayController';
import { TimeOfDayUtility } from 'src/util/time_of_day/TimeOfDayUtility';
import { UnitUtility } from 'src/util/UnitUtility';
import { ScheduledHabitUtil } from 'src/util/ScheduledHabitUtil';
import { differenceInDays } from 'date-fns';

interface Props {
    scheduledHabit: ScheduledHabit;
}

function getExpirationMessage(startDate: Date, endDate: Date) {
    // Calculate the difference in days
    const diffInDays = differenceInDays(endDate, startDate);

    if (diffInDays === 0) {
        return 'version expires today';
    } else if (diffInDays === 1) {
        return 'version expires tomorrow';
    } else if (diffInDays > 1) {
        return `version expires in ${diffInDays} days`;
    } else {
        return 'version expired';
    }
}

export const HabitSummaryElement = ({ scheduledHabit }: Props) => {
    const colors = useTheme().colors;

    const daysOfWeekEnabled = scheduledHabit.daysOfWeekEnabled;
    const timesOfDayEnabled = scheduledHabit.timesOfDayEnabled;
    const detailsEnabled = scheduledHabit.detailsEnabled;

    const timeOfDays = TimesOfDayCustomHooks.useTimesOfDay();
    const optimalImageData = ScheduledHabitUtil.getOptimalImage(scheduledHabit);
    const title = ScheduledHabitUtil.getTitle(scheduledHabit);

    const quantity = scheduledHabit.quantity;
    const unit = scheduledHabit.unit;
    const prettyUnits = UnitUtility.getReadableUnit(unit, quantity);

    const endDate = scheduledHabit.endDate;
    const expires = endDate && getExpirationMessage(new Date(), endDate);

    let habitView: JSX.Element = <View />;
    if (endDate) {
        habitView = (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                    style={{
                        color: colors.error,
                        fontFamily: POPPINS_REGULAR,
                        fontSize: 10,
                    }}
                >
                    {expires}
                </Text>
            </View>
        );
    }

    return (
        <View
            style={{
                width: '100%',
                paddingHorizontal: 12,
            }}
        >
            <View
                style={[
                    {
                        backgroundColor: colors.card_background,
                        borderRadius: 9,
                        flex: 1,
                        alignItems: 'center',
                        padding: 12,
                    },
                    CARD_SHADOW,
                ]}
            >
                <View
                    style={{
                        width: '100%',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                    }}
                >
                    {habitView}
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#404040',
                            padding: 4,
                            borderRadius: 9,
                        }}
                    >
                        <View style={{ height: 30, width: 30 }}>
                            <OptimalImage
                                data={optimalImageData}
                                style={{ height: 30, width: 30 }}
                            />
                        </View>
                    </View>
                    <Text
                        style={{
                            textAlign: 'center',
                            color: colors.text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 20,
                            flex: 1,
                        }}
                    >
                        {title}
                    </Text>

                    <View style={{ width: 40 }}></View>
                </View>

                {daysOfWeekEnabled && (
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            width: '100%',
                            paddingTop: PADDING_SMALL,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
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
                    </View>
                )}

                {timesOfDayEnabled && (
                    <View
                        style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            paddingTop: PADDING_SMALL,
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
                )}

                {detailsEnabled && (
                    <View
                        style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            paddingTop: PADDING_SMALL,
                        }}
                    >
                        <Text style={{ color: colors.text, fontFamily: POPPINS_REGULAR }}>
                            goal:{' '}
                            <Text style={{ color: colors.accent_color }}>
                                {quantity} {prettyUnits}
                            </Text>
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};
