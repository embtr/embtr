import React from 'react';
import { View, Text, Image } from 'react-native';
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

export const UserProfileProBadge = () => {

    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
    });

    if (!fontsLoaded) {
        return <View />
    }

    return (
            <View style={{ width: 38, height: 20, backgroundColor: "#F14C6B", borderRadius: 6, alignItems: "center", justifyContent: "center" }}>
                <Text style={{fontSize: 10.5, fontFamily: "Poppins_600SemiBold", color: "white"}}>Pro</Text>
        </View>
    );
};