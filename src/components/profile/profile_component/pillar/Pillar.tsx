import * as React from 'react';
import { View, Text, TextStyle, ViewStyle } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    name: string
};

export const Pillar = ({ name }: Props) => {
    const { colors } = useTheme();

    const nameTextStyle = {
        fontSize: 16,
        color: colors.text,
    } as TextStyle;

    const attributeTextStyle = {
        fontSize: 12,
        color: colors.secondary_text,
    } as TextStyle;

    const pillarViewStyle = {
        marginBottom: 10,
        marginTop: 10,
        paddingLeft: 10,
        alignItems: "center"
    } as ViewStyle;

    return (
        <View>
            <HorizontalLine />
            <View style={pillarViewStyle}>
                <Text style={nameTextStyle}>{name}</Text>
                <View style={{ flexDirection: "row", paddingTop: 10, width:"100%" }}>
                    <Text style={[attributeTextStyle, { flex: 1, textAlign: "center" }]}>attribute 1</Text>
                    <Text style={[attributeTextStyle, { flex: 1, textAlign: "center" }]}>attribute 2</Text>
                    <Text style={[attributeTextStyle, { flex: 1, textAlign: "center" }]}>attribute 3</Text>
                </View>
            </View>
            <HorizontalLine />
        </View>
    );
};