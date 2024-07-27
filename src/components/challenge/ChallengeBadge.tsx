import { View } from 'react-native';
import { OptimalImage, OptimalImageData } from '../common/images/OptimalImage';

interface Props {
    optimalImage: OptimalImageData;
    size: number;
    opaque?: boolean;
}

export const ChallengeBadge = ({ optimalImage: imageData, size, opaque }: Props) => {
    return (
        <View style={{ width: size, height: size }}>
            <OptimalImage
                data={imageData}
                style={{ height: size, width: size, opacity: opaque ? 0.2 : undefined }}
            />
        </View>
    );
};
