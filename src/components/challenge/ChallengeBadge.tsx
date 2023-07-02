import { View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { ChallengeReward } from 'resources/schema';

interface Props {
    reward: ChallengeReward;
    size: number;
    opaque?: boolean;
}

export const ChallengeBadge = ({ reward, size, opaque }: Props) => {
    if (!reward.imageUrl) {
        return <View />;
    }

    return (
        <SvgUri
            width={size}
            height={size}
            uri={reward.imageUrl}
            style={{ opacity: opaque ? 0.5 : undefined }}
        />
    );
};
