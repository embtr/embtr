import { User } from 'resources/schema';
import { View } from 'react-native';
import { NewUserBadge } from './NewUserBadge';

interface Props {
    user: User;
    size: number;
    white?: boolean;
}

export const OptionalNewUserBadge = ({ user, size }: Props) => {
    const createdDate = user.createdAt;
    const isNewUser =
        createdDate && new Date().getTime() - createdDate.getTime() < 7 * 24 * 60 * 60 * 1000;
    if (!isNewUser) {
        return <View />;
    }

    return <NewUserBadge size={size} />;
};
