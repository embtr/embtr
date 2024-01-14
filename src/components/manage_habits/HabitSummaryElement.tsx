import { HabitSummary } from 'resources/types/habit/Habit';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { OptimalImage, OptimalImageData } from 'src/components/common/images/OptimalImage';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    habitSummary: HabitSummary;
}

export const HabitSummaryElement = ({ habitSummary }: Props) => {
    const colors = useTheme().colors;

    const optimalImageData: OptimalImageData = {
        localImage: habitSummary.task.localImage,
        remoteImageUrl: habitSummary.task.remoteImageUrl,
    };

    const nextHabitDays = habitSummary.nextHabitDays;
    const lastHabitDays = habitSummary.lastHabitDays;

    const nextHabitInFuture = nextHabitDays && nextHabitDays > 0;
    const nextHabitIsToday =
        (nextHabitDays !== undefined && nextHabitDays === 0) ||
        (lastHabitDays !== undefined && lastHabitDays === 0);
    const lastHabitInPast = lastHabitDays && lastHabitDays > 0;

    let habitView: JSX.Element = <View />;
    if (nextHabitInFuture) {
        habitView = (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                    style={{
                        color: colors.secondary_text,
                        fontFamily: POPPINS_REGULAR,
                        fontSize: 10,
                    }}
                >
                    next habit in
                    <Text
                        style={{
                            color: colors.accent_color,
                        }}
                    >
                        {' '}
                        {nextHabitDays} day{nextHabitDays === 1 ? '' : 's'}
                    </Text>
                </Text>
            </View>
        );
    } else if (nextHabitIsToday) {
        habitView = (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                    style={{
                        color: colors.secondary_text,
                        fontFamily: POPPINS_REGULAR,
                        fontSize: 10,
                    }}
                >
                    next habit is
                    <Text
                        style={{
                            color: colors.accent_color,
                        }}
                    >
                        {' today'}
                    </Text>
                </Text>
            </View>
        );
    } else if (lastHabitInPast) {
        habitView = (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                    style={{
                        color: colors.secondary_text,
                        fontFamily: POPPINS_REGULAR,
                        fontSize: 10,
                    }}
                >
                    last habit {lastHabitDays} day{lastHabitDays === 1 ? '' : 's'} ago
                </Text>
            </View>
        );
    }

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
                <View style={{ height: 40, width: 40 }}>
                    <OptimalImage data={optimalImageData} style={{ height: 40, width: 40 }} />
                </View>
                <View style={{ paddingLeft: TIMELINE_CARD_PADDING, flex: 1 }}>
                    <Text
                        style={{
                            color: colors.text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 18,
                        }}
                    >
                        {habitSummary.task.title}
                    </Text>
                    <View style={{ height: TIMELINE_CARD_PADDING / 2 }} />

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                            style={{
                                color: colors.secondary_text,
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 10,
                            }}
                        >
                            {habitSummary.activeScheduledCount}{' '}
                            {habitSummary.activeScheduledCount > 1 ? 'habits' : 'habit'} scheduled
                        </Text>
                        <View style={{ flex: 1 }} />
                        {habitView}
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
        </View>
    );
};
