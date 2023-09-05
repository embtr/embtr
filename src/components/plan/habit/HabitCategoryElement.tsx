import { View, Text } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { HabitCategory } from 'resources/schema';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_REGULAR } from 'src/util/constants';

interface Props {
    habitCategory: HabitCategory;
}

export const HabitCategoryElement = ({ habitCategory }: Props) => {
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
                <SvgUri
                    width={50}
                    height={50}
                    uri={
                        'https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/habit_categories%2Flayers.svg?alt=media'
                    }
                />
                <View style={{ paddingLeft: 9 }}>
                    <Text
                        style={{
                            color: colors.text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 22,
                        }}
                    >
                        Physical Health
                    </Text>
                    <Text
                        style={{
                            color: colors.secondary_text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 10,
                            bottom: 5,
                        }}
                    >
                        Fitness routines, balanced nutrition, restful sleep
                    </Text>
                </View>
            </View>
        </View>
    );
};
