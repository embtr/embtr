import { View } from 'react-native';
import { OptimalImageData } from 'src/components/common/images/OptimalImage';
import { NestedImage } from './NestedImage';

interface Props {
    imageData: OptimalImageData[];
    size: number;
    padSize: number;
    paddingStep: number;
}

export const NestedImages = ({ imageData, size, padSize, paddingStep }: Props) => {
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

    const paddingLeft =
        imageData.length === 1 ? paddingStep : imageData.length === 2 ? paddingStep / 2 : 0;
    const paddingTop =
        imageData.length === 1 ? paddingStep : imageData.length === 2 ? paddingStep / 2 : 0;

    return (
        <View
            style={{
                height: size + paddingStep * 2,
                width: size + paddingStep * 2,
                flexDirection: 'row',
                paddingLeft: paddingLeft,
                paddingTop: paddingTop,
            }}
        >
            {elements}
        </View>
    );
};
