import React from 'react';
import { View, Text, Image } from 'react-native';
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import LevelController, { LevelModel } from 'src/controller/level/LevelController';

interface Props {
    userProfileModel: UserProfileModel;
}

export const ProfileLevel = ({ userProfileModel }: Props) => {
    const [level, setLevel] = React.useState<LevelModel>();

    React.useEffect(() => {
        const getLevel = async () => {
            const level = await LevelController.get(userProfileModel.uid!);
            setLevel(level);
        };

        getLevel();
    }, []);

    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
    });

    if (!fontsLoaded) {
        return <View />;
    }

    if (!level) {
        return <View />;
    }

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('assets/profile_level_background.png')} style={{ width: 23, height: 23 }} />
            <View style={{ position: 'absolute', zIndex: 2 }}>
                <Text style={{ fontSize: 9, fontFamily: 'Poppins_600SemiBold', color: 'white' }}>{LevelController.calculateLevel(level)}</Text>
            </View>
        </View>
    );
};
