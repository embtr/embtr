import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { WidgetBase } from 'src/components/widgets/WidgetBase';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { getMonthDayFormatted, getYesterday } from 'src/util/DateUtility';
import { getWindowWidth } from 'src/util/GeneralUtility';

interface Props {
    uid: string;
}

export const DailyHistoryWidget = ({ uid }: Props) => {
    const { colors } = useTheme();
    const diameter = 9;
    const margin = ((getWindowWidth() - 25) / 30 - diameter) / 2;

    const [history, setHistory] = React.useState<string[]>([]);

    React.useEffect(() => {
        fetch();
    }, []);

    const fetch = async () => {
        const history = await DailyResultController.getDailyResultHistory(uid);
        setHistory(history);
    };

    const isSuccess = (s: string) => {
        return 'COMPLETE' === s;
    };

    const isFailed = (s: string) => {
        return 'FAILED' === s;
    };

    let views: JSX.Element[] = [];
    for (let i = 0; i < history.length; i++) {
        const historyElement = history[i];

        views.push(
            <View
                key={historyElement + i}
                style={{
                    backgroundColor: isSuccess(historyElement)
                        ? colors.progress_bar_complete
                        : isFailed(historyElement)
                        ? colors.progress_bar_failed
                        : colors.progress_bar_color,
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
        if (!isSuccess(history[i])) {
            break;
        }

        streak++;
    }

    const yesterday = getYesterday();

    const twoWeeksAgo = getYesterday();
    twoWeeksAgo.setDate(getYesterday().getDate() - 15);

    const fourWeeksAgo = getYesterday();
    fourWeeksAgo.setDate(getYesterday().getDate() - 30);

    const yesterdayFormatted = getMonthDayFormatted(yesterday);
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
