import * as React from 'react';
import { View, Button, Text } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { ThemeToggle } from 'src/components/theme/ThemeToggle';
import { getAuth } from 'firebase/auth';
import { useAppDispatch } from 'src/redux/Hooks';
import { setAccessLevel } from 'src/redux/user/GlobalState';

export const UserSettings = () => {
    const dispatch = useAppDispatch();

    return (
        <Screen>
            <Banner name='Settings' leftIcon={"arrow-back"} leftRoute="BACK" />

            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ThemeToggle />
                    <Text style={{ color: 'grey' }}>     Light Mode/Dark Mode</Text>  
                </View>
                <View>
                    <Button title='logout' onPress={() => { getAuth().signOut(); dispatch(setAccessLevel("invalid")); }}></Button>
                </View>
            </View>
        </Screen>
    );
}