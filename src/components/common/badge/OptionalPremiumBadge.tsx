import { User } from 'resources/schema';
import { UserService } from 'src/service/UserService';
import { View } from 'react-native';
import { PremiumBadge } from './PremiumBadge';

interface Props {
    user: User;
    size: number;
    white?: boolean;
}

export const OptionalPremiumBadge = ({ user, size, white }: Props) => {
    const userIsPremium = UserService.userHasPremiumRole(user);
    if (!userIsPremium) {
        return <View />;
    }

    return <PremiumBadge size={size} white={white} />;
};
