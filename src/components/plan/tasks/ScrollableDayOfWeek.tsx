import React from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    day: string,
    selected: boolean,
    onPress: Function
}

export const ScrollableDayOfWeek = ({ day, selected, onPress }: Props) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity onPress={() => { onPress() }}>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <View style={{ alignContent: "center", alignItems: "center" }}>
                    <View style={{ borderWidth: 1, borderRadius: 5, width: 40, height: 40, alignContent: "center", alignItems: "center", justifyContent: "center", backgroundColor: selected ? "green" : "gray" }}>
                        <Text style={{ color: colors.text, fontSize: 20 }}>{day}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};