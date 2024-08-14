import { View } from 'react-native';
import { User } from 'resources/schema';
import { UserBadge } from './UserBadge';
import { PADDING_SMALL } from 'src/util/constants';
import { UserPropertyUtil } from 'src/util/UserPropertyUtil';
import { Constants } from 'resources/types/constants/constants';

// "Oopsy this is all wrong need to update" - LtConquer - 2024-06-19

const blacklistedBadgeCategories = [
    Constants.BadgeCategory.LEVEL,
    Constants.BadgeCategory.HABIT_STREAK_TIER,
];

interface Props {
    user: User;
    size: number;
}

export const BadgeBelt = ({ user, size }: Props) => {
    const userIsBlacklisted = UserPropertyUtil.isSocialBlacklisted(user);

    const badges = [...(user.userBadges ?? [])];
    const sortedBadges = badges.sort((a, b) => (a.badge?.priority ?? 0) - (b.badge?.priority ?? 0));
    const filteredBadges = userIsBlacklisted
        ? sortedBadges.filter((badge) => {
            const badgeCategory = Constants.getBadgeCategory(badge.badge?.category ?? '');
            return !blacklistedBadgeCategories.includes(badgeCategory);
        })
        : sortedBadges;

    const badgeElements = [];
    for (const badge of filteredBadges ?? []) {
        badgeElements.push(
            <View key={badge.id} style={{ paddingRight: PADDING_SMALL / 3 }}>
                <UserBadge key={badge.userId + '_' + badge.id} size={size} userBadge={badge} />
            </View>
        );
    }

    return <View style={{ flexDirection: 'row', alignItems: 'center' }}>{badgeElements}</View>;
};
