import React from 'react';
import { View, Text } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';

export const PlanningSummaryHeader = () => {
    const { colors } = useTheme();

    return (
        <View>
            <View style={{ height: "auto", paddingTop: 5, paddingBottom: 5 }}>
                <View style={{ padding: 5 }}>
                    <Text style={{ color: colors.text, textAlign: "center", paddingBottom: 5 }}>
                        Summary
                    </Text>

                    <View style={{ flexDirection: "row", padding: 5 }}>
                        <Text style={{ flex: 1, color: colors.text, textAlign: "center" }}>
                            Total Shards: 10
                        </Text>

                        <Text style={{ flex: 1, color: colors.text, textAlign: "center" }}>
                            Total Shards: 10
                        </Text>

                        <Text style={{ flex: 1, color: colors.text, textAlign: "center" }}>
                            Total Shards: 10
                        </Text>
                    </View>
                </View>
            </View>
            
            <HorizontalLine />
        </View>
    );
};