import React from 'react';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Text, View, Image } from 'react-native';
import { getAuth } from 'firebase/auth';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { useFocusEffect } from '@react-navigation/native';
import ProfileController from 'src/controller/profile/ProfileController';

interface Props {
    size: number
}

export const UserTabElement = ({ size }: Props) => {
    const { colors } = useTheme();

    const [userProfileModel, setUserProfileModel] = React.useState<UserProfileModel | undefined>(undefined);

    useFocusEffect(
        React.useCallback(() => {
            const uid = getAuth().currentUser?.uid;
            if (uid) {
                ProfileController.getProfile(uid, (profile: UserProfileModel) => {
                    setUserProfileModel(profile);
                });
            }
        }, [])
    );

    return (
        <View style={{ alignItems: "center", justifyContent: "center", marginTop: 10 }}>
            <View style={{ width: size + 2, height: size + 2, borderRadius: 50, backgroundColor: colors.tab_bar_menu, alignItems: "center", justifyContent: "center" }}>
                { userProfileModel &&  <Image style={{ width: size, height: size, borderRadius: 50 }} source={{ uri: userProfileModel.photoUrl }} /> }
            </View>
        </View>
    );
};