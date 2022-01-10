import * as React from 'react';
import { View } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { UserSearchResult } from 'src/components/profile/search/UserSearchResult';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';

interface Props {
    searchResults: UserProfileModel[]
}

export const UserSearchResults = ({ searchResults }: Props) => {
    const { colors } = useTheme();

    let resultViews: JSX.Element[] = [];
    searchResults.forEach(userProfileModel => {
        resultViews.push(
            <View key={userProfileModel.email} style={{width:"100%"}}>
                <UserSearchResult userProfileModel={userProfileModel} />
                <HorizontalLine />
            </View>
        );
    });
    return (
        <View style={{width:"100%"}}>
            {resultViews}
        </View>
    );
}