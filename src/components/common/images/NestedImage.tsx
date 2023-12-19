import { View } from 'react-native';
import { OptimalImage, OptimalImageData } from 'src/components/common/images/OptimalImage';
import { CARD_SHADOW } from 'src/util/constants';

interface Props {
    image: OptimalImageData;
    size: number;
    padSize?: number;
}

export const NestedImage = ({ image, size, padSize }: Props) => {
    return (
        <View style={CARD_SHADOW}>
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
                        borderColor: 'black',
                        borderWidth: 0.4,
                        height: size - (padSize ?? 0),
                        width: size - (padSize ?? 0),
                    }}
                />
            </View>
        </View>
    );
};
