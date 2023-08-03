import { View, Text } from 'react-native';
import { HabitJourney } from 'resources/types/habit/Habit';
import { LineChart } from 'react-native-chart-kit';
import { getWindowWidth } from 'src/util/GeneralUtility';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';

interface Props {
    habitJourney: HabitJourney;
}

export const HabitJourneyElement3 = ({ habitJourney }: Props) => {
    const { colors, isDark } = useTheme();

    const dataset = [];
    for (const element of habitJourney.elements) {
        dataset.push(element.daysInSeason);
    }

    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];

    // loop over each element and store the first season of every month in a list with its element index
    const labels: string[] = [];
    for (const element of habitJourney.elements) {
        let month = monthNames[element.seasonDate.getUTCMonth()];
        if (labels.includes(month)) {
            month = '';
        }

        labels.push(month);
    }

    const data = {
        labels: labels,
        datasets: [
            {
                data: dataset,
                color: (opacity = 1) => colors.link, // optional
                strokeWidth: 2, // optional
            },

            {
                color: (opacity = 1) => `rgba(134, 65, 244, 0)`, // optional
                data: [0],
            },
            {
                color: (opacity = 1) => `rgba(134, 65, 244, 0)`, // optional
                data: [7],
            },
        ],
        legend: ['Habit Points'],
    };

    const screenWidth = getWindowWidth() - 20;

    return (
        <View
            style={{
                width: '100%',
                flex: 1,
            }}
        >
            <Text
                style={{
                    color: colors.text,
                    fontFamily: POPPINS_REGULAR,
                    fontSize: 12,
                    paddingLeft: 2,
                    zIndex: 1,
                    position: 'absolute',
                }}
            >
                {habitJourney.habit.title}:{' '}
                <Text
                    style={{
                        color: colors.tab_selected,
                        fontFamily: POPPINS_REGULAR,
                        fontSize: 12,
                        paddingLeft: 2,
                        zIndex: 1,
                        position: 'absolute',
                    }}
                >
                    level {habitJourney.level}
                </Text>
            </Text>

            <View style={{ zIndex: 1, position: 'absolute', width: '100%', top: 102, left: 20 }}>
                <Text
                    style={{
                        fontFamily: POPPINS_SEMI_BOLD,
                        color: colors.link,
                        right: 5,
                    }}
                >
                    *
                </Text>
            </View>
            <LineChart
                style={{ paddingRight: 25, marginRight: 0, marginLeft: 0, paddingLeft: 0 }}
                data={data}
                width={screenWidth}
                segments={7}
                height={220}
                withVerticalLines={false}
                chartConfig={{
                    fillShadowGradientFrom: colors.tab_selected,
                    fillShadowGradientTo: colors.tab_selected,
                    fillShadowGradientFromOffset: 1,
                    fillShadowGradientToOffset: 0.001,
                    fillShadowGradientFromOpacity: 0.1,
                    fillShadowGradientToOpacity: 1,
                    decimalPlaces: 0,
                    backgroundGradientFrom: colors.timeline_card_background,
                    backgroundGradientTo: colors.timeline_card_background,
                    color: (opacity = 1) =>
                        isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) =>
                        isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
                    propsForDots: {},
                }}
            />
            <View style={{ width: '100%', alignItems: 'center' }}>
                <Text
                    style={{
                        fontSize: 12,
                        fontFamily: POPPINS_SEMI_BOLD,
                        color: colors.link,
                        paddingLeft: 20,
                        paddingTop: 10,
                        lineHeight: 12,
                        width: '100%',
                    }}
                >
                    * Habit Level Threshold
                    <Text
                        style={{
                            fontSize: 11,
                            fontFamily: POPPINS_REGULAR,
                            color: colors.link,
                            paddingLeft: 20,
                            paddingTop: 10,
                            lineHeight: 12,
                        }}
                    >
                        {' '}
                        - Earn 4 or more Habit Points in a season to level up your habit! Anything
                        less will level you down; consistency is key!
                    </Text>
                </Text>
            </View>
        </View>
    );
};
