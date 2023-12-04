import { Text, View } from 'react-native';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';
import { User } from 'resources/schema';
import { PlannedDayCustomHooks } from 'src/controller/planning/PlannedDayController';
import { PlanDay } from '../plan/planning/PlanDay';
import { PlanningService } from 'src/util/planning/PlanningService';
import { getCurrentUid } from 'src/session/CurrentUserProvider';

export enum WidgetSource {
    TODAY,
    PROFILE,
}

interface Props {
    user: User;
    source: WidgetSource;
}

export const TodaysActivitiesWidget = ({ user, source }: Props) => {
    const { colors } = useTheme();

    const isCurrentUser = user.uid === getCurrentUid();

    // this is only getting the current user's planne day, you'll likely
    // need to pass in the user id to get the guest's planned day
    const todaysPlannedDay = PlannedDayCustomHooks.useTodaysPlannedDay();

    const onSharePlannedDayResults = async () => {
        if (todaysPlannedDay.data) {
            await PlanningService.sharePlannedDayResults(todaysPlannedDay.data);
        }
    };

    return (
        <WidgetBase
            symbol={isCurrentUser ? 'add-outline' : undefined}
            onPressSymbol={isCurrentUser ? () => {} : undefined}
        >
            <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>
                Today's Activities
            </Text>

                <View style={{ paddingTop: 10, flexDirection: 'row' }}>
                    <Text style={{ color: colors.text }}>It looks like today is a </Text>
                    <Text style={{ color: colors.tab_selected }}>rest day.</Text>
                </View>
        </WidgetBase>
    );
};
