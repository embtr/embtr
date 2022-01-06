import * as React from 'react';
import { useTheme } from "src/components/theme/ThemeProvider";
import { useAppSelector } from "src/redux/hooks";
import { getUser } from "src/redux/user/UserSlice";
import { Text, TextStyle, View, Image, SafeAreaView } from 'react-native';
import { Screen } from 'src/components/common/screen';
import { Banner } from 'src/components/common/Banner';

export const UserProfile = () => {
    const { colors } = useTheme();
    const textStyle = {
        fontSize: 18,
        color: colors.text,
    } as TextStyle;

    const user = useAppSelector(getUser);

    return (
        <Screen>
            <SafeAreaView style={{ flex: 1 }}>
                <Banner name='You' rightIcon={"cog-outline"} rightRoute="UserSettings" />

                <View style={{ flexDirection: "column", flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={{ width: 100, height: 100, borderRadius: 50 }} source={{ uri: user.profileUrl }} />
                        <Text style={textStyle}>{user.displayName}</Text>
                        <Text style={textStyle}>{user.email}</Text>
                    </View>
                </View>
            </SafeAreaView>
        </Screen>

    );
}