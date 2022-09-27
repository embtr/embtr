import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    height: number
}

export const TimeIndicatorLine = ({ height }: Props) => {
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
        <View style={{ flexDirection: "row", zIndex: 2, position: "absolute", marginTop: height, width: "100%" }}>
                        <View style={{width: 40, alignContent: "flex-end", alignItems: "center"}} />

            <View style={{ flexGrow: 1, paddingRight: 18, justifyContent: "center" }}>
                <View style={{ height: 1, width: "100%", backgroundColor: colors.today_calendar_time_indicator }} />
            </View>
        </View>
    );
};