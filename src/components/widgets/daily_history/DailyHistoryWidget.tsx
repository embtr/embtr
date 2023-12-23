import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { WidgetBase } from 'src/components/widgets/WidgetBase';
import { DailyHistoryCustomHooks } from 'src/controller/daily_history/DailyHistoryController';
import { POPPINS_REGULAR, POPPINS_SEMI_BOLD, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { getMonthDayFormatted, getYesterday } from 'src/util/DateUtility';
import { getWindowWidth } from 'src/util/GeneralUtility';

interface Props {
    userId: number;
}

export const DailyHistoryWidget = ({ userId }: Props) => {
    const { colors } = useTheme();
    const diameter = 9;
    const margin = ((getWindowWidth() - 40) / 30 - diameter) / 2;

    const dailyHistory = DailyHistoryCustomHooks.useDailyHistory(userId);

    if (!dailyHistory.data) {
        return <View />;
    }

    const history = dailyHistory.data.history;

    let views: JSX.Element[] = [];
    for (let i = 0; i < history.length; i++) {
        const historyElement = history[i];

        views.push(
            <View
                key={i}
                style={{
                    backgroundColor: historyElement.complete
                        ? colors.progress_bar_complete
                        : colors.progress_bar_color,
                    height: diameter,
                    width: diameter,
                    borderRadius: 1,
                }}
            />
        );

        views.push(<View style={{ flex: 1 }} />);
    }
    views.pop();

    let streak = 0;
    for (let i = history.length - 1; i >= 0; i--) {
        if (!history[i].complete) {
            break;
        }

        streak++;
    }

    const today = new Date();

    const twoWeeksAgo = getYesterday();
    twoWeeksAgo.setDate(getYesterday().getDate() - 15);

    const fourWeeksAgo = getYesterday();
    fourWeeksAgo.setDate(getYesterday().getDate() - 30);

    const yesterdayFormatted = getMonthDayFormatted(today);
    const twoWeeksAgoFormatted = getMonthDayFormatted(twoWeeksAgo);
    const fourWeeksAgoFormatted = getMonthDayFormatted(fourWeeksAgo);

    return (
        <WidgetBase>
            <View style={{ flexDirection: 'row' }}>
                <Text
                    style={{
                        color: colors.text,
                        fontFamily: POPPINS_SEMI_BOLD,
                        fontSize: 15,
                        lineHeight: 17,
                        bottom: 2,
                    }}
                >
                    Daily History
                </Text>

                <View style={{ flex: 1 }} />

                <View>
                    <Text
                        style={{
                            color: colors.text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 12,
                            lineHeight: 14,
                            bottom: 3,
                        }}
                    >
                        current streak:
                        <Text
                            style={{
                                color: colors.accent_color_light,
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 12,
                                paddingTop: 5,
                            }}
                        >
                            {' '}
                            {streak} {streak == 1 ? 'day' : 'days'}
                        </Text>
                    </Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', paddingTop: TIMELINE_CARD_PADDING / 4 }}>
                {views}
            </View>

            <View style={{ flexDirection: 'row', paddingTop: 1 }}>
                <View style={{ flex: 1, paddingTop: 2 }}>
                    <Text
                        style={{
                            color: colors.secondary_text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 8,
                        }}
                    >
                        {' '}
                        {fourWeeksAgoFormatted}
                    </Text>
                </View>

                <View style={{ flex: 1, paddingTop: 2, alignItems: 'center' }}>
                    <Text
                        style={{
                            color: colors.secondary_text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 8,
                        }}
                    >
                        {' '}
                        {twoWeeksAgoFormatted}
                    </Text>
                </View>

                {/* date on the right */}
                <View style={{ flex: 1, paddingTop: 2, alignItems: 'flex-end' }}>
                    <Text
                        style={{
                            color: colors.secondary_text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 8,
                        }}
                    >
                        {yesterdayFormatted}{' '}
                    </Text>
                </View>
            </View>
        </WidgetBase>
    );
};
