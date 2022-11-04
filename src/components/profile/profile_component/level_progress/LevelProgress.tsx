import { getAuth } from 'firebase/auth';
import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { getWindowWidth } from 'src/util/GeneralUtility';

interface Props {
    user: UserProfileModel;
}

export const LevelProgress = ({ user }: Props) => {
    const { colors } = useTheme();
    const diameter = 8;
    const margin = ((getWindowWidth() * 0.98 - 10) / 30 - diameter) / 2;

    const [history, setHistory] = React.useState<string[]>([]);

    React.useEffect(() => {
        fetch();
    }, []);

    const fetch = async () => {
        if (!user.uid) {
            return;
        }

        const history = await DailyResultController.getDailyResultHistory(user.uid);
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
                    borderRadius: 25,
                    marginLeft: margin,
                    marginRight: margin,
                }}
            />
        );
    }

    return (
        <View style={{ paddingRight: 5, paddingLeft: 5, backgroundColor: colors.timeline_card_background, borderRadius: 7 }}>
            <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD }}>History</Text>
            <Text style={{ color: colors.text, fontFamily: POPPINS_REGULAR, fontSize: 12, paddingTop: 2 }}>current streak: 2 days</Text>
            <View style={{ flexDirection: 'row', paddingTop: 3, paddingBottom: 10 }}>{views}</View>
        </View>
    );
};
