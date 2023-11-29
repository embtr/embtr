import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_REGULAR } from 'src/util/constants';
import { Ionicons } from '@expo/vector-icons';
import { CachedImage } from 'src/components/common/images/CachedImage';
import { OptimalImage, OptimalImageData } from 'src/components/common/images/OptimalImage';

interface Props {
    optimalImageData: OptimalImageData;
    name: string;
    description: string;
    isCustomHabits?: boolean;
}

export const AddHabitElement = ({ optimalImageData, name, description, isCustomHabits }: Props) => {
    const { colors } = useTheme();

    return (
        <View
            style={{
                width: '100%',
                paddingHorizontal: 12,
                paddingTop: 12,
                flexDirection: 'row',
            }}
        >
            <View
                style={[
                    {
                        backgroundColor: isCustomHabits ? '#484848' : '#282828',
                        borderRadius: 9,
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 12,
                    },
                    CARD_SHADOW,
                ]}
            >
                <View style={{ height: 40, width: 40 }}>
                    <OptimalImage data={optimalImageData} style={{ height: 40, width: 40 }} />
                </View>
                <View style={{ paddingLeft: 15, flex: 1 }}>
                    <Text
                        style={{
                            color: colors.text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 18,
                        }}
                    >
                        {name}
                    </Text>
                    <Text
                        style={{
                            color: colors.secondary_text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 10,
                            bottom: 5,
                        }}
                    >
                        {description}
                    </Text>
                </View>
                <View>
                    <Ionicons
                        name={'chevron-forward-outline'}
                        size={18}
                        color={colors.secondary_text}
                    />
                </View>
            </View>
        </View>
    );
};
