import React from 'react';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Text, View, Image } from 'react-native';
import { getAuth } from 'firebase/auth';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { useFocusEffect } from '@react-navigation/native';
import ProfileController from 'src/controller/profile/ProfileController';
import { User } from 'resources/schema';
import UserController from 'src/controller/user/UserController';

interface Props {
    size: number;
}

export const UserTabElement = ({ size }: Props) => {
    const { colors } = useTheme();
    const [currentUser, setCurrentUser] = React.useState<User>();

    const fetch = async () => {
        const currentUser = await UserController.getCurrentUser();
        if (currentUser.user) setCurrentUser(currentUser.user);
    };

    useFocusEffect(
        React.useCallback(() => {
            fetch();
        }, [])
    );

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
            <View
                style={{
                    width: size + 2,
                    height: size + 2,
                    borderRadius: 50,
                    backgroundColor: colors.tab_bar_menu,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {currentUser && <Image style={{ width: size, height: size, borderRadius: 50 }} source={{ uri: currentUser.photoUrl }} />}
            </View>
        </View>
    );
};
