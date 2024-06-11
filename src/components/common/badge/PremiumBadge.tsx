import { OptimalImage, OptimalImageData } from '../images/OptimalImage';

const premiumBadgeData: OptimalImageData = {
    localImage: 'PROFILE.VERIFIED_BADGE',
};

const premiumBadgeDataWhite: OptimalImageData = {
    localImage: 'PROFILE.PADLOCK',
};

interface Props {
    size: number;
    white?: boolean;
}

export const PremiumBadge = ({ size, white }: Props) => {
    return (
        <OptimalImage
            data={white ? premiumBadgeDataWhite : premiumBadgeData}
            style={{
                width: size,
                height: size,
                bottom: 0.5,
            }}
        />
    );
};
