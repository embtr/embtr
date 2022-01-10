import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, View, Image, TextStyle, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/RootStackParamList';

type userProfileScreenProp = StackNavigationProp<RootStackParamList, 'UserProfile'>;

interface Props {
    userProfileModel: UserProfileModel
}

export const UserSearchResult = ({ userProfileModel }: Props) => {
    const { colors } = useTheme();

    const textStyle = {
        fontSize: 18,
        color: colors.text,
    } as TextStyle;

    const navigation = useNavigation<userProfileScreenProp>();

    return (
        <View>
            <TouchableOpacity onPress={() => { navigation.navigate('UserProfile', {userProfileModel: userProfileModel}) }}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 10, paddingBottom: 10 }}>
                    <View><Image style={{ width: 35, height: 35, borderRadius: 50, marginLeft: 10, marginRight: 10 }} source={{ uri: userProfileModel?.photoUrl }} /></View>
                    <View><Text style={textStyle}>{userProfileModel?.name}</Text></View>
                </View>
            </TouchableOpacity>
        </View>
    );
}