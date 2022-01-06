import * as React from 'react';
import { useAppDispatch } from "src/redux/hooks";
import { clearUser } from "src/redux/user/UserSlice";
import { View, SafeAreaView, Button } from 'react-native';
import { Screen } from 'src/components/common/screen';
import { Banner } from 'src/components/common/Banner';
import { ThemeToggle } from 'src/components/theme/themeToggle';

export const UserSettings = () => {

    const dispatch = useAppDispatch();

    return (
        <Screen>
            <SafeAreaView style={{ flex: 1 }}>
                <Banner name='Settings' leftIcon={"arrow-back"} leftRoute="Dashboard" />

                <View style={{ flexDirection: "column", flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ThemeToggle />
                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                        <Button title='logout' onPress={() => { dispatch(clearUser()); }}></Button>
                    </View>
                </View>
            </SafeAreaView>
        </Screen>

    );
}