import * as React from 'react';
import { Text, TextStyle, View, Image, ImageURISource } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    title: string,
    body: string,
    image?: ImageURISource,
}

export const TimelineElement = ({ title, body, image }: Props) => {
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

            <View style={{ height: 275, marginLeft: 10, marginRight: 10 }}>
                <View>
                    <Text style={[headerTextStyle, { paddingTop: 20, textAlign: "center" }]}>{title}</Text>
                </View>

                {image && <View style={{ alignItems: "center", paddingTop: 20 }}>
                    <Image source={image} style={{ width: 200, height: 200 }} />
                </View>}
            </View>

            <HorizontalLine />
            <View style={{ marginTop: 15, marginBottom:15}}>
                <Text style={[bodyTextStyle, {paddingLeft:"2.5%", paddingRight:"2.5%", textAlign: "left" }]}>{body}</Text>
            </View>
            <HorizontalLine />
        </View>
    );
}