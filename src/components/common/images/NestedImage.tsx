import { View } from 'react-native';
import { OptimalImage, OptimalImageData } from 'src/components/common/images/OptimalImage';
import { ShadowUtility } from 'src/util/ui/shadow/ShadowUtility';

interface Props {
    image: OptimalImageData;
    size: number;
    padSize?: number;
}

const SHADOW = ShadowUtility.getShadow(55);

export const NestedImage = ({ image, size, padSize }: Props) => {
    return (
        <View
            style={{
                ...SHADOW,
            }}
        >
            <View
                style={{
                    borderRadius: 5,
                    width: size,
                    height: size,
                    backgroundColor: '#6a6a6a',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <OptimalImage
                    data={image}
                    style={{
                        borderRadius: 5,
                        height: size - (padSize ?? 0),
                        width: size - (padSize ?? 0),
                    }}
                />
            </View>
        </View>
    );
};
