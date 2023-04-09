import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';
import { User } from 'resources/schema';
import { DayResult } from 'resources/types/widget/DailyHistory';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { WidgetBase } from 'src/components/widgets/WidgetBase';
import { DailyHistoryController } from 'src/controller/daily_history/DailyHistoryController';
import { POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { getMonthDayFormatted, getYesterday } from 'src/util/DateUtility';
import { getWindowWidth } from 'src/util/GeneralUtility';

interface Props {
    userId: number;
}

export const DailyHistoryWidget = ({ userId }: Props) => {
    const { colors } = useTheme();
    const diameter = 9;
    const margin = ((getWindowWidth() - 25) / 30 - diameter) / 2;

    const [history, setHistory] = React.useState<DayResult[]>([]);

    const fetch = async () => {
        if (!userId) {
            return;
        }

        const dailyHistory = await DailyHistoryController.get(userId);
        setHistory(dailyHistory.history);
    };

    useFocusEffect(
        React.useCallback(() => {
            setHistory([]);
            fetch();
        }, [userId])
    );

    if (!history) {
        return <View />;
    }

    const isSuccess = (s: string) => {
        return 'COMPLETE' === s;
    };

    const isFailed = (s: string) => {
        return 'FAILED' === s || 'INCOMPLETE' === s;
    };

    let views: JSX.Element[] = [];
    for (let i = 0; i < history.length; i++) {
        const historyElement = history[i];

        views.push(
            <View
                key={historyElement.dayKey + historyElement.complete + i}
                style={{
                    backgroundColor: historyElement.complete ? colors.progress_bar_complete : colors.progress_bar_color,
                    height: diameter,
                    width: diameter,
                    borderRadius: 2.7,
                    marginLeft: margin,
                    marginRight: margin,
                }}
            />
        );
    }

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
            <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>Daily History</Text>

            <Text style={{ color: colors.text, fontFamily: POPPINS_REGULAR, fontSize: 12, paddingTop: 5 }}>
                current streak:
                <Text style={{ color: colors.tab_selected, fontFamily: POPPINS_REGULAR, fontSize: 12, paddingTop: 5 }}>
                    {' '}
                    {streak} {streak == 1 ? 'day' : 'days'}
                </Text>
            </Text>

            <View style={{ flexDirection: 'row', paddingTop: 5 }}>{views}</View>

            <View style={{ flexDirection: 'row', paddingTop: 1 }}>
                <View style={{ flex: 1, paddingTop: 2 }}>
                    <Text style={{ color: colors.secondary_text, fontFamily: POPPINS_REGULAR, fontSize: 8 }}> {fourWeeksAgoFormatted}</Text>
                </View>

                <View style={{ flex: 1, paddingTop: 2, alignItems: 'center' }}>
                    <Text style={{ color: colors.secondary_text, fontFamily: POPPINS_REGULAR, fontSize: 8 }}> {twoWeeksAgoFormatted}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={{ color: colors.secondary_text, fontFamily: POPPINS_REGULAR, fontSize: 8 }}>{yesterdayFormatted} </Text>
                </View>
            </View>
        </WidgetBase>
    );
};
