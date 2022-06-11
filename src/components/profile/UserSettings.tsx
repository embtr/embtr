import * as React from 'react';
import { View, Button, Text } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { ThemeToggle } from 'src/components/theme/ThemeToggle';
import { getAuth } from 'firebase/auth';
import { useAppDispatch } from 'src/redux/Hooks';
import { setAccessLevel } from 'src/redux/user/GlobalState';
import { EmbtrToggle } from 'src/components/common/toggle/EmbtrToggle';
import { EmbtrButton2 } from 'src/components/common/button/EmbtrButton2';

export const UserSettings = () => {
    const dispatch = useAppDispatch();

    return (
        <Screen>
            <Banner name='Settings' leftIcon={"arrow-back"} leftRoute="BACK" />

            <View style={{ flex: 1, flexDirection: 'column', alignItems: "center" }}>
                <View style={{ paddingTop: 10 }}>
                    <ThemeToggle />
                </View>
                <View style={{ paddingTop: 10, alignItems: "center" }}>
                    <EmbtrButton2 text={"Sign Out"} icon={"caret-forward-circle-outline"} onPress={() => { getAuth().signOut(); dispatch(setAccessLevel("invalid")); }} />
                </View>
            </View>
        </Screen>
    );
}