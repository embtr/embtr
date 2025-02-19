import { TouchableOpacity, Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CARD_SHADOW, POPPINS_MEDIUM, PADDING_LARGE } from 'src/util/constants';

const MATERIAL_ICONS = ['pillar', 'vote-outline'];

interface Props {
    text: string;
    secondaryText?: string;
    secondaryTextColor?: string;
    icon?: any;
    onPress: Function;
}

export const EmbtrButton2 = ({ text, secondaryText, secondaryTextColor, icon, onPress }: Props) => {
    const { colors } = useTheme();

    return (
        <View
            style={[
                {
                    backgroundColor: colors.accent_color_faint,
                    height: 75,
                    width: '100%',
                    borderRadius: 3,
                    flexDirection: 'row',
                },
                CARD_SHADOW,
            ]}
        >
            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'row' }}
                    onPress={() => {
                        onPress();
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            paddingLeft: PADDING_LARGE * 2,
                            justifyContent: 'center',
                        }}
                    >
                        {secondaryText && (
                            <Text
                                style={{
                                    color: secondaryTextColor ?? colors.secondary_text,
                                    fontFamily: POPPINS_MEDIUM,
                                    fontSize: 12,
                                    top: 2,
                                }}
                            ></Text>
                        )}

                        <Text
                            style={{
                                color: colors.button_text,
                                fontFamily: POPPINS_MEDIUM,
                                fontSize: 15,
                                alignItems: 'flex-start',
                            }}
                        >
                            {text}
                        </Text>

                        {secondaryText && (
                            <Text
                                style={{
                                    color: secondaryTextColor ?? colors.secondary_text,
                                    fontFamily: POPPINS_MEDIUM,
                                    fontSize: 12,
                                    top: 2,
                                }}
                            >
                                {secondaryText}
                            </Text>
                        )}
                    </View>

                    <View
                        style={{
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            paddingRight: 30,
                        }}
                    >
                        {icon ? (
                            MATERIAL_ICONS.includes(icon) ? (
                                <MaterialCommunityIcons
                                    name={icon}
                                    size={32}
                                    color={colors.goal_secondary_font}
                                />
                            ) : (
                                <Ionicons
                                    style={{ paddingLeft: 10 }}
                                    name={icon}
                                    size={32}
                                    color={colors.text}
                                />
                            )
                        ) : (
                            <View />
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};
