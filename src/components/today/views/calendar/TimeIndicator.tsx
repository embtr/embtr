import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';

export const TimeIndicator = () => {
    const { colors } = useTheme();

    const [hours, setHours] = React.useState(new Date().getHours());
    const [minutes, setMinutes] = React.useState(new Date().getMinutes());


    useFocusEffect(
        React.useCallback(() => {
            setTimeout(() => {
                setMinutes(new Date().getMinutes());
                setHours(new Date().getHours());
            }, 61000);
        }, [minutes])
    );

    return (
        <View style={{ zIndex: 1, position: "absolute", height: hours * 60 + minutes, width: "100%", justifyContent: "flex-end" }}>
            <HorizontalLine color={colors.primary_border} />
        </View>
    );
};