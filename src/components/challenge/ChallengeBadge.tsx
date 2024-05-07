import { View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { Award } from 'resources/schema';

interface Props {
    award: Award;
    size: number;
    opaque?: boolean;
}

export const ChallengeBadge = ({ award, size, opaque }: Props) => {
    if (!award.remoteImageUrl) {
        return <View style={{ width: size, height: size }} />;
    }

    return (
        <View style={{ width: size, height: size }}>
            <SvgUri
                width={size}
                height={size}
                uri={award.remoteImageUrl}
                opacity={opaque ? 0.2 : undefined}
            />
        </View>
    );
};
