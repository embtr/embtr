import { View } from 'react-native';
import { User } from 'resources/schema';
import { UserBadge } from './UserBadge';
import { PADDING_SMALL } from 'src/util/constants';

interface Props {
    user: User;
    size: number;
}

// "Oopsy this is all wrong need to update" - LtConquer - 2024-06-19

export const BadgeBelt = ({ user, size }: Props) => {
    const badges = [...(user.userBadges ?? [])];
    const sortedBadges = badges.sort((a, b) => (a.badge?.priority ?? 0) - (b.badge?.priority ?? 0));

    const badgeElements = [];
    for (const badge of sortedBadges ?? []) {
        badgeElements.push(
            <View style={{ paddingRight: PADDING_SMALL / 3 }}>
                <UserBadge key={badge.userId + '_' + badge.id} size={size} userBadge={badge} />
            </View>
        );
    }

    return <View style={{ flexDirection: 'row', alignItems: 'center' }}>{badgeElements}</View>;
};
