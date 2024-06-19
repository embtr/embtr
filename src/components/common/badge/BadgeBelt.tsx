import { View } from 'react-native';
import { User } from 'resources/schema';
import { OptionalPremiumBadge } from './OptionalPremiumBadge';
import { UserPropertyUtil } from 'src/util/UserPropertyUtil';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { OptionalNewUserBadge } from './OptionalNewUserBadge';
import { OptionalHabitStreakBadge } from './OptionalHabitStreakBadge';

interface Props {
    user: User;
    size: number;
}

// "Oopsy this is all wrong need to update" - LtConquer - 2024-06-19

export const BadgeBelt = ({ user, size }: Props) => {
    const colors = useTheme().colors;
    const userIsAway = UserPropertyUtil.isAway(user);

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <OptionalPremiumBadge user={user} size={size} />
            <OptionalNewUserBadge user={user} size={size} />
            <OptionalHabitStreakBadge user={user} size={size} />

            {userIsAway && (
                <Ionicons
                    style={{ left: 4 }}
                    name={'airplane-sharp'}
                    size={size}
                    color={colors.link}
                />
            )}
        </View>
    );
};
