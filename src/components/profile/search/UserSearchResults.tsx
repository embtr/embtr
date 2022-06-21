import * as React from 'react';
import { View } from 'react-native';
import { UserSearchResult } from 'src/components/profile/search/UserSearchResult';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';

interface Props {
    followingUids: string[],
    onFollowUser: Function,
    onUnfollowUser: Function,
    searchResults: UserProfileModel[]
}

export const UserSearchResults = ({ followingUids, onFollowUser, onUnfollowUser, searchResults }: Props) => {

    let resultViews: JSX.Element[] = [];
    searchResults.forEach(userProfileModel => {
        const following = followingUids.includes(userProfileModel.uid!);

        resultViews.push(
            <View key={userProfileModel.email}>
                <View style={{ alignItems: "center", paddingTop: 10 }}>
                    <UserSearchResult userProfileModel={userProfileModel} onFollowUser={onFollowUser} onUnfollowUser={onUnfollowUser} following={following} />
                </View>
            </View>
        );
    });

    return (
        <View>
            {resultViews}
        </View>
    );
}