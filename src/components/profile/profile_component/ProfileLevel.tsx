import React from 'react';
import { View, Text, Image } from 'react-native';
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import LevelController, { LevelModel } from 'src/controller/level/LevelController';
import { User } from 'resources/schema';

interface Props {
    user: User;
    useSmall?: boolean;
}

export const ProfileLevel = ({ user, useSmall }: Props) => {
    const [level, setLevel] = React.useState<LevelModel>();

    const levelSize = useSmall === true ? 12 : 23;
    const fonstSize = useSmall ? 8 : 10;

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('assets/profile_level_background.png')} style={{ width: levelSize, height: levelSize }} />
            <View style={{ position: 'absolute', zIndex: 2 }}>
                <Text style={{ fontSize: fonstSize, fontFamily: 'Poppins_600SemiBold', color: 'white' }}>0</Text>
            </View>
        </View>
    );
};
