import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    size?: number;
}

export const ChallengeBadge = ({ size }: Props) => {
    const colors = useTheme().colors;

    return (
        <View>
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: size,
                    height: size,
                    borderWidth: 2,
                    borderColor: colors.secondary_accent_color,
                    borderRadius: 50,
                }}
            >
                <Ionicons name={'flash'} size={16} color={colors.secondary_accent_color} />
            </View>
        </View>
    );
};
