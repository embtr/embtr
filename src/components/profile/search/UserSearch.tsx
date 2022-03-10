import * as React from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserSearchResults } from 'src/components/profile/search/UserSearchResults';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import UserSearchResultObject from 'src/firebase/firestore/user/UserSearchResultObject';
import FollowerController from 'src/controller/follower/FollowerController';
import { useFocusEffect } from '@react-navigation/native';
import { UserSearchUtility } from 'src/util/user/UserSearchUtility';
import { getAuth } from 'firebase/auth';

export const UserSearch = () => {
    const { colors } = useTheme();

    const [userSearchUtility, setUserSearchUtility] = React.useState<UserSearchUtility | undefined>(undefined);
    const [searchText, setSearchText] = React.useState("");

    const [searchResults, setSearchResults] = React.useState<UserSearchResultObject | undefined>(undefined);
    const [followingUids, setFollowingUids] = React.useState<string[]>([]);

    const onSearchChange = (text: string) => {
        setSearchText(text);
        if (userSearchUtility) {
            userSearchUtility.updateSearch(text, setSearchResults);
        }
    }

    const onFollowUser = (uid: string) => {
        let followingUidsCopy = followingUids.slice(0);
        followingUidsCopy.push(uid);
        setFollowingUids(followingUidsCopy);
    }

    const onUnfollowUser = (uid: string) => {
        let followingUidsCopy = followingUids.slice(0);
        for (var i = followingUidsCopy.length - 1; i >= 0; i--) {
            if (followingUidsCopy[i] === uid) {
                followingUidsCopy.splice(i, 1);
                setFollowingUids(followingUidsCopy);
                return;
            }
        }
    }

    React.useEffect(() => {
        setUserSearchUtility(new UserSearchUtility());
    }, []);

    React.useEffect(() => {
        onSearchChange("");
    }, [userSearchUtility]);

    useFocusEffect(
        React.useCallback(() => {
            FollowerController.getFollowing(getAuth().currentUser!.uid, setFollowingUids);
        }, [])
    );

    return (
        <Screen>
            <Banner name='User Search' leftIcon={"arrow-back"} leftRoute="Timeline" />

            <ScrollView>
                <View style={{ alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", width: "60%" }} >
                        <View style={{ position: "absolute", zIndex: 1, paddingTop: 30, paddingLeft: 18 }} >
                            <Ionicons name={'search'} size={22} color={colors.text} />
                        </View>
                        <TextInput
                            style={{ marginTop: 30, paddingLeft: 60, height: 40, width: "100%", borderColor: colors.text, borderWidth: 1, borderRadius: 50, color: colors.text, fontSize: 20 }}
                            onChangeText={onSearchChange}
                            value={searchText}
                            placeholderTextColor={colors.secondary_text}
                            placeholder={"enter search"}
                            autoCapitalize='none'
                        />
                    </View>

                    <View style={{ paddingTop: 20, width: "100%" }}>
                        <HorizontalLine />
                        {searchResults?.results
                            ? <UserSearchResults followingUids={followingUids} onFollowUser={onFollowUser} onUnfollowUser={onUnfollowUser} searchResults={searchResults.results!} />
                            : <UserSearchResults followingUids={followingUids} onFollowUser={onFollowUser} onUnfollowUser={onUnfollowUser} searchResults={[]} />}
                    </View>
                </View>
            </ScrollView>
        </Screen>

    );
}