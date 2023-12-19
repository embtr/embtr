import { View } from 'react-native';
import { OptimalImageData } from 'src/components/common/images/OptimalImage';
import { NestedImage } from './NestedImage';

interface Props {
    imageData: OptimalImageData[];
    size: number;
    padSize: number;
}

const paddingStep = 2.5;
export const NestedImages = ({ imageData, size, padSize }: Props) => {
    const elements: JSX.Element[] = [];
    for (let i = 0; i < Math.min(imageData.length, 3); i++) {
        const image = imageData[i];
        const element = (
            <View style={{ right: i * (size - paddingStep), top: i * paddingStep }}>
                <NestedImage image={image} size={size} padSize={padSize} />
            </View>
        );
        elements.push(element);
    }

    const paddingLeft = 0; //; imageData.length === 1 ? 5 : imageData.length === 2 ? 2.5 : 0;
    const paddingTop = 0; // imageData.length === 1 ? 2.5 : imageData.length === 2 ? 1.25 : 0;

    return (
        <View
            style={{
                height: 65,
                width: 70,
                backgroundColor: 'pink',
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    paddingLeft: paddingLeft,
                    paddingTop: paddingTop,
                    backgroundColor: 'orange',
                }}
            >
                {elements}
            </View>
        </View>
    );
};
