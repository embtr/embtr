import { View, Text } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { HabitCategory } from 'resources/schema';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_REGULAR } from 'src/util/constants';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    habitCategory: HabitCategory;
    expanded: boolean;
}

export const HabitCategoryCard = ({ habitCategory, expanded }: Props) => {
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
                <SvgUri width={50} height={50} uri={habitCategory.imageUrl ?? ''} />
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
                        name={expanded ? 'chevron-down-outline' : 'chevron-up-outline'}
                        size={18}
                        color={colors.secondary_text}
                    />
                </View>
            </View>
        </View>
    );
};
