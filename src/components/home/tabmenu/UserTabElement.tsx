import React from 'react';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Text, View, Image } from 'react-native';
import { getAuth } from 'firebase/auth';

interface Props {
    size: number
}

export const UserTabElement = ({ size }: Props) => {
    const { colors } = useTheme();

    const userProfileUrl = getAuth().currentUser?.photoURL;

    return (
        <View style={{ alignItems: "center", justifyContent: "center", marginTop: 10 }}>
            <View style={{ width: size + 2, height: size + 2, borderRadius: 50, backgroundColor: colors.tab_bar_menu, alignItems: "center", justifyContent: "center" }}>
                <Image style={{ width: size, height: size, borderRadius: 50 }} source={{ uri: userProfileUrl! }} />
            </View>
        </View>
    );
};