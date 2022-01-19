import * as React from 'react';
import { Text, TextStyle, View } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    title: string,
    body: string
}

export const TimelineElement = ({ title, body }: Props) => {
    const { colors } = useTheme();

    const headerTextStyle = {
        fontSize: 22,
        color: colors.text,
    } as TextStyle;

    const bodyTextStyle = {
        fontSize: 14,
        color: colors.text,
    } as TextStyle;

    return (
        <View>
            <HorizontalLine />

            <View style={{ marginTop: 15, marginBottom: 15, marginLeft: 10, marginRight: 10 }}>
                <View>
                    <Text style={[headerTextStyle, { textAlign: "center" }]}>{title}</Text>
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text style={[bodyTextStyle, { textAlign: "center" }]}>{body}</Text>
                </View>
            </View>

            <HorizontalLine />
        </View>
    );
}