import * as React from 'react';
import { Text, TextStyle, View, Image } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { Profile } from 'src/components/profile/Profile';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    profile?: Profile
}

export const ProfileHeader = ({ profile }: Props) => {
    const { colors } = useTheme();

    const textStyle = {
        fontSize: 14,
        color: colors.text,
    } as TextStyle;

    return (
        <View>
            <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 12 }}>
                    <View style={{ paddingLeft: 25, paddingTop: 15 }}><Image style={{ width: 100, height: 100, borderRadius: 50 }} source={{ uri: "" }} /></View>
                    <View style={{ paddingLeft: 15, paddingTop: 15 }}><Text style={[textStyle, { fontSize: 24 }]}>brent</Text></View>
                </View>

                <View style={{ flex: 12, flexDirection: "row" }}>

                    <View style={{ flex: 5, flexDirection: "column" }}>
                        <View><Text style={[textStyle, { textAlign: "center", paddingTop: 30 }]}>89M</Text></View>
                        <View><Text style={[textStyle, { textAlign: "center", paddingTop: 5 }]}>followers</Text></View>
                    </View>

                    <View style={{ flex: 5, flexDirection: "column" }}>
                        <View><Text style={[textStyle, { textAlign: "center", paddingTop: 30 }]}>12</Text></View>
                        <View><Text style={[textStyle, { textAlign: "center", paddingTop: 5 }]}>following</Text></View>
                    </View>
                    <View style={{ flex: 2 }} />

                </View>

            </View>
            <View style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 15, paddingBottom: 15 }}>
                <Text style={textStyle}>{profile?.bio ? profile.bio : ""}</Text>
            </View>
            <HorizontalLine />
        </View>
    )
}