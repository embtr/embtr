import { View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { ChallengeReward } from 'resources/schema';

interface Props {
    reward: ChallengeReward;
    size: number;
    opaque?: boolean;
}

export const ChallengeBadge = ({ reward, size, opaque }: Props) => {
    if (!reward.remoteImageUrl) {
        return <View style={{ width: size, height: size }} />;
    }

    return (
        <View style={{ width: size, height: size }}>
            <SvgUri
                width={size}
                height={size}
                uri={reward.remoteImageUrl}
                opacity={opaque ? 0.2 : undefined}
            />
        </View>
    );
};
