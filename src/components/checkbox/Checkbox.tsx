import React from 'react';
import { Text, View } from 'react-native';
import { CARD_SHADOW, POPPINS_REGULAR, PADDING_LARGE } from 'src/util/constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    text?: string;
    checked: boolean;
    onCheck: () => void;
}

export const Checkbox = ({ text, checked, onCheck }: Props) => {
    const colors = useTheme().colors;

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {text && (
                <View>
                    <Text
                        style={{
                            color: colors.secondary_text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 12,
                        }}
                    >
                        {text}
                    </Text>
                    <View style={{ width: PADDING_LARGE / 2 }} />
                </View>
            )}

            <TouchableOpacity
                onPress={() => {
                    onCheck();
                }}
                style={[
                    {
                        backgroundColor: '#404040',
                        borderRadius: 5,
                        paddingHorizontal: 4,
                        paddingVertical: 2,
                    },
                    CARD_SHADOW,
                ]}
            >
                <Ionicons
                    name={'checkmark-done-sharp'}
                    size={20}
                    color={checked ? colors.accent_color_light : '#404040'}
                />
            </TouchableOpacity>
        </View>
    );
};
