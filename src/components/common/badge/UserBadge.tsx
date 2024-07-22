import { UserBadge as UserBadgeData } from 'resources/schema';
import { OptimalImage, OptimalImageData } from '../images/OptimalImage';

interface Props {
    userBadge: UserBadgeData;
    size: number;
}

export const UserBadge = ({ userBadge, size }: Props) => {
    const data: OptimalImageData = {
        ...userBadge.badge?.icon,
    };

    return (
        <OptimalImage
            data={data}
            style={{
                width: size,
                height: size,
            }}
        />
    );
};
