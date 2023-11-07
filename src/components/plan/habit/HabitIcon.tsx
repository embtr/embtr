import { View } from 'react-native';
import { SvgUri } from 'react-native-svg';

interface Props {
    iconUrl: string;
    size: number;
    color: string;
}

export const HabitIcon = ({ iconUrl, size, color }: Props) => {
    return (
        <View>
            <SvgUri width={size} height={size} uri={iconUrl} />
        </View>
    );
};
