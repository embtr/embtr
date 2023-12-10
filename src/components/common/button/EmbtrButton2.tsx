import * as React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useFonts, Poppins_500Medium } from '@expo-google-fonts/poppins';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CARD_SHADOW, SETTINGS_MENU_ITEM_WIDTH } from 'src/util/constants';

interface Props {
    text: string;
    icon?: any;
    onPress: Function;
}

export const EmbtrButton2 = ({ text, icon, onPress }: Props) => {
    const { colors } = useTheme();

    return (
        <View
            style={[
                {
                    backgroundColor: colors.accent_color_faint,
                    width: SETTINGS_MENU_ITEM_WIDTH,
                    height: 75,
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
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text
                            style={{
                                color: colors.button_text,
                                fontFamily: 'Poppins_500Medium',
                                fontSize: 15,
                                alignItems: 'flex-start',
                                paddingLeft: 30,
                            }}
                        >
                            {text}
                        </Text>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            paddingRight: 30,
                        }}
                    >
                        {icon ? (
                            icon === 'pillar' ? (
                                <MaterialCommunityIcons
                                    name="pillar"
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
