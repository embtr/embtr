import { User } from 'resources/schema';
import { UserService } from 'src/service/UserService';
import { OptimalImage, OptimalImageData } from './images/OptimalImage';

const premiumBadgeData: OptimalImageData = {
    localImage: 'PROFILE.VERIFIED_BADGE',
};

interface Props {
    user: User;
    size: number;
}

export const PremiumBadge = ({ user, size }: Props) => {
    const userIsPremium = UserService.userHasPremiumRole(user);

    if (!userIsPremium) {
        return;
    }

    return (
        <OptimalImage
            data={premiumBadgeData}
            style={{
                width: size,
                height: size,
                bottom: 0.5,
            }}
        />
    );
};
