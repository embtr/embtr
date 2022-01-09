import * as React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';

interface Props {
    searchResults: UserProfileModel[]
}

export const UserSearchResults = ({ searchResults }: Props) => {
    const { colors } = useTheme();


    let resultViews: JSX.Element[] = [];
    searchResults.forEach(element => {
        resultViews.push(
            <View>
                <Text style={{ color: colors.text }}>{element.name} {element.email}</Text>
            </View>
        );
    });
    return (
        <View>
            {resultViews}
        </View>
    );
}