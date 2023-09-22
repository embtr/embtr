import { View, Text } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { HabitCategory } from 'resources/schema';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_REGULAR } from 'src/util/constants';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    habitCategory: HabitCategory;
}

export const HabitCategoryCard = ({ habitCategory }: Props) => {
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
                        backgroundColor: colors.timeline_card_background,
                        borderRadius: 9,
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 12,
                    },
                    CARD_SHADOW,
                ]}
            >
                <View style={{ height: 50, width: 50 }}>
                    <SvgUri width={50} height={50} uri={habitCategory.imageUrl ?? ''} />
                </View>
                <View style={{ paddingLeft: 9, flex: 1 }}>
                    <Text
                        style={{
                            color: colors.text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 22,
                        }}
                    >
                        {habitCategory.name}
                    </Text>
                    <Text
                        style={{
                            color: colors.secondary_text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 10,
                            bottom: 5,
                        }}
                    >
                        {habitCategory.description}
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
