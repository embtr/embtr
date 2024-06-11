import { OptimalImage, OptimalImageData } from '../images/OptimalImage';

const badgeData: OptimalImageData = {
    localImage: 'PROFILE.NEW_USER',
};

interface Props {
    size: number;
}

export const NewUserBadge = ({ size }: Props) => {
    return (
        <OptimalImage
            data={badgeData}
            style={{
                width: size,
                height: size,
                bottom: 0.5,
            }}
        />
    );
};
