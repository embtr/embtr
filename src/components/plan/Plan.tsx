import React from 'react';
import { View, Text } from 'react-native';
import { DaysOfWeek } from 'src/components/plan/DaysOfWeek';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    name: string
}

export const Plan = ({ name }: Props) => {
    const { colors } = useTheme();

    return (
        <View style={{ backgroundColor: colors.card_background }}>
            <View style={{ height: "auto", paddingTop: 5, paddingBottom: 5 }}>
                <View style={{ padding: 5 }}>
                    <Text style={{ color: colors.text, textAlign: "center" }}>
                        {name}
                    </Text>
                </View>

                <View style={{ paddingTop: 5 }}>
                    <DaysOfWeek />
                </View>

                <Text style={{ color: colors.text, textAlign: "center", paddingTop: 5 }}>
                    At 11:45 AM for 1 Hour
                </Text>
                <View style={{ flex: 1 }} />

                <View style={{ flexDirection: "row", paddingTop: 15 }}>
                    <Text style={{ flex: 1, fontSize: 12, color: colors.secondary_text, textAlign: "center" }}>
                        attribute 1
                    </Text>

                    <Text style={{ flex: 1, fontSize: 12, color: colors.secondary_text, textAlign: "center" }}>
                        attribute 2
                    </Text>

                    <Text style={{ flex: 1, fontSize: 12, color: colors.secondary_text, textAlign: "center" }}>
                        attribute 3
                    </Text>

                    <Text style={{ flex: 1, fontSize: 12, color: colors.secondary_text, textAlign: "center" }}>
                        attribute 4
                    </Text>
                </View>

                <View style={{ flexDirection: "row", paddingTop: 1 }}>
                    <Text style={{ flex: 1, color: colors.secondary_text, textAlign: "center" }}>
                        value 1
                    </Text>

                    <Text style={{ flex: 1, color: colors.secondary_text, textAlign: "center" }}>
                        value 2
                    </Text>

                    <Text style={{ flex: 1, color: colors.secondary_text, textAlign: "center" }}>
                        value 3
                    </Text>

                    <Text style={{ flex: 1, color: colors.secondary_text, textAlign: "center" }}>
                        value 4
                    </Text>
                </View>
            </View>
        </View>
    );
};