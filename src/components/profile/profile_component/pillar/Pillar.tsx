import * as React from 'react';
import { View, Text, TextStyle, ViewStyle } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PillarModel } from 'src/model/PillarModel';

interface Props {
    pillarModel: PillarModel
};

export const Pillar = ({ pillarModel }: Props) => {
    const { colors } = useTheme();

    const nameTextStyle = {
        fontSize: 16,
        color: colors.text,
    } as TextStyle;

    const attributeHeaderTextStyle = {
        fontSize: 12,
        color: colors.secondary_text,
    } as TextStyle;

    const attributeValueTextStyle = {
        fontSize: 12,
        color: colors.pillar_attribute,
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
                <Text style={nameTextStyle}>{pillarModel.name}</Text>
                <View style={{ flexDirection: "row", paddingTop: 10, width:"100%" }}>
                    <Text style={[attributeHeaderTextStyle, { flex: 1, textAlign: "center" }]}>added</Text>
                    <Text style={[attributeHeaderTextStyle, { flex: 1, textAlign: "center" }]}>accuracy</Text>
                    <Text style={[attributeHeaderTextStyle, { flex: 1, textAlign: "center" }]}>this week</Text>
                </View>
                <View style={{ flexDirection: "row", width:"100%" }}>
                    <Text style={[attributeValueTextStyle, { flex: 1, textAlign: "center" }]}>{pillarModel.added.toDate().toDateString()}</Text>
                    <Text style={[attributeValueTextStyle, { flex: 1, textAlign: "center", color:"green" }]}>100%</Text>
                    <Text style={[attributeValueTextStyle, { flex: 1, textAlign: "center" }]}>12</Text>
                </View>
            </View>
            <HorizontalLine />
        </View>
    );
};