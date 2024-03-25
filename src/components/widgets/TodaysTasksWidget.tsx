import { Text, View } from 'react-native';
import { POPPINS_SEMI_BOLD, PADDING_LARGE } from 'src/util/constants';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';
import { User } from 'resources/schema';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
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

    const isCurrentUser = user.uid === getCurrentUid();

    return (
        <WidgetBase
            symbol={isCurrentUser ? 'add-outline' : undefined}
            onPressSymbol={isCurrentUser ? () => { } : undefined}
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

            <View style={{ paddingTop: PADDING_LARGE }} />

            <PlanTodayForUser user={user} />
        </WidgetBase>
    );
};
