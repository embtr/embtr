import { View } from 'react-native';
import { OptimalImage, OptimalImageData } from 'src/components/common/images/OptimalImage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PADDING_MEDIUM } from 'src/util/constants';

interface Props {
    optimalImageData: OptimalImageData;
    size: number;
    isChallenge?: boolean;
}

export const HabitIcon = ({ optimalImageData, size, isChallenge }: Props) => {
    const colors = useTheme().colors;

    return (
        <View style={{ height: size, width: size }}>
            {isChallenge && (
                <View
                    style={{
                        position: 'absolute',
                        zIndex: 1,
                        top: -PADDING_MEDIUM - 1,
                        right: -PADDING_MEDIUM - 1,
                    }}
                >
                    <Ionicons name={'flash'} size={16} color={colors.secondary_accent_color} />
                </View>
            )}
            <OptimalImage data={optimalImageData} style={{ height: size, width: size }} />
        </View>
    );
};
