import * as React from 'react';
import { Text, TextStyle, View, Image, ImageSourcePropType } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    staticImage?: ImageSourcePropType,
    httpImage?: string,
    name: string,
    title: string,
    body: string,
}

export const TextCard = ({ staticImage, httpImage, name, title, body }: Props) => {
    const { colors } = useTheme();

    const headerTextStyle = {
        fontSize: 20,
        color: colors.text,
    } as TextStyle;

    const bodyTextStyle = {
        fontSize: 14,
        color: colors.text,
    } as TextStyle;

    return (
        <View>
            <HorizontalLine />

            <View style={{ height: "auto", marginLeft: 10, marginRight: 10, alignItems: "center" }}>
                <View style={{ width: "100%" }}><Text style={[bodyTextStyle, { textAlign: "right", color: "gray", fontSize: 12 }]}>Jan 20, 2022</Text></View>
                {staticImage && <View><Image style={{ width: 45, height: 45, borderRadius: 50 }} source={staticImage} /></View>}
                {httpImage && <View><Image style={{ width: 45, height: 45, borderRadius: 50 }} source={{ uri: httpImage }} /></View>}
                <View><Text style={[bodyTextStyle, { padding: 5 }]}>{name}</Text></View>
                <View>
                    <Text style={[headerTextStyle, { paddingTop: 5, textAlign: "center" }]}>{title}</Text>
                </View>

                <View style={{ marginTop: 15, marginBottom: 5 }}>
                    <Text style={[bodyTextStyle, { paddingLeft: "2.5%", paddingRight: "2.5%", textAlign: "left" }]}>{body}</Text>
                    <Text style={[bodyTextStyle, { color: "gray", fontSize: 12, textAlign: "right", marginTop: 5 }]}>view more...</Text>
                </View>
            </View>

            <HorizontalLine />
        </View>
    );
}