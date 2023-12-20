import { Text, View } from 'react-native';
import { POPPINS_SEMI_BOLD, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';
import { User } from 'resources/schema';
import { PlannedDayCustomHooks } from 'src/controller/planning/PlannedDayController';
import { PlanningService } from 'src/util/planning/PlanningService';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { TodaysTasksWidgetImproved } from 'src/components/widgets/planning/TodaysTasksWidgetImproved';
import { PlanToday } from 'src/components/plan/planning/PlanToday';
import { PlanTodayForUser } from 'src/components/plan/planning/PlanTodayForUser';

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

    const restDayView = (
        <Text style={{ color: colors.text }}>
            It looks like today is a{' '}
            <Text style={{ color: colors.accent_color_light }}>rest day.</Text>
        </Text>
    );

    const isCurrentUser = user.uid === getCurrentUid();

    return (
        <WidgetBase
            symbol={isCurrentUser ? 'add-outline' : undefined}
            onPressSymbol={isCurrentUser ? () => {} : undefined}
        >
            <Text
                style={{
                    color: colors.text,
                    fontFamily: POPPINS_SEMI_BOLD,
                    fontSize: 15,
                    lineHeight: 17,
                }}
            >
                Today's Activities
            </Text>

            <View style={{ paddingTop: TIMELINE_CARD_PADDING }} />

            <PlanTodayForUser user={user} />

            {/*<View style={{ paddingTop: TIMELINE_CARD_PADDING }}>{restDayView}</View>*/}
        </WidgetBase>
    );
};
