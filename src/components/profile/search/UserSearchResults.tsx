import * as React from 'react';
import { View } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { UserSearchResult } from 'src/components/profile/search/UserSearchResult';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';

interface Props {
    followingUids: string[],
    searchResults: UserProfileModel[]
}

export const UserSearchResults = ({ followingUids, searchResults }: Props) => {

    let resultViews: JSX.Element[] = [];
    searchResults.forEach(userProfileModel => {
        const following = followingUids.includes(userProfileModel.uid!);

        resultViews.push(
            <View key={userProfileModel.email}>
                <View style={{ alignItems: "center" }}>
                    <UserSearchResult following={following} userProfileModel={userProfileModel} />
                </View>
                <HorizontalLine />
            </View>
        );
    });
    return (
        <View>
            {resultViews}
        </View>
    );
}