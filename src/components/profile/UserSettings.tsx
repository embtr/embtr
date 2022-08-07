import * as React from 'react';
import { View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { ThemeToggle } from 'src/components/theme/ThemeToggle';
import { getAuth } from 'firebase/auth';
import { useAppDispatch } from 'src/redux/Hooks';
import { setAccessLevel } from 'src/redux/user/GlobalState';
import { EmbtrButton2 } from 'src/components/common/button/EmbtrButton2';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileTabScreens } from 'src/navigation/RootStackParamList';
import { EditUserProfile } from './EditUserProfile';

export const UserSettings = () => {
    const dispatch = useAppDispatch();

    const navigation = useNavigation<StackNavigationProp<ProfileTabScreens>>();

    const navigateToEditUserProfile = () => {
        navigation.navigate('EditUserProfile');
    }

    return (
        <Screen>
            <Banner name='Settings' leftIcon={"arrow-back"} leftRoute="BACK" />

            <View style={{ flex: 1, flexDirection: 'column', alignItems: "center" }}>
                <View style={{ paddingTop: 10 }}>
                    <ThemeToggle />
                </View>
                
                <View style={{ paddingTop: 10, alignItems: "center" }}>
                    <EmbtrButton2 text={"Edit Profile"} icon={"ios-pencil-sharp"} onPress={() => { navigateToEditUserProfile() }} />
                </View>

                <View style={{ paddingTop: 10, alignItems: "center" }}>
                    <EmbtrButton2 text={"Edit Pillars"} icon={"pillar"} onPress={() => { alert("Tell Brent to get this working!") }} />
                </View>

                <View style={{ paddingTop: 10, alignItems: "center" }}>
                    <EmbtrButton2 text={"Sign Out"} icon={"exit-outline"} onPress={() => { getAuth().signOut(); dispatch(setAccessLevel("invalid")); }} />
                </View>
            </View>
        </Screen>
    );
}