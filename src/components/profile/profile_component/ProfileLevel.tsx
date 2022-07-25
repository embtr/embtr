import React from 'react';
import { View, Text, Image } from 'react-native';
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

interface Props {
    level: number
}

export const ProfileLevel = ({ level }: Props) => {

    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
    });

    if (!fontsLoaded) {
        return <View />
    }

    return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Image source={require('assets/profile_level_background.png')} style={{ width: 23, height: 23 }} />
            <View style={{ position: "absolute", zIndex: 2 }}>
                <Text style={{fontSize: 9, fontFamily: "Poppins_600SemiBold", color: "white"}}>12</Text>
            </View>
        </View>
    );
};