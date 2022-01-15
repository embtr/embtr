import * as React from 'react';
import { SafeAreaView, TextInput, View } from 'react-native';
import { Screen } from 'src/components/common/screen';
import { Banner } from 'src/components/common/Banner';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'src/components/theme/ThemeProvider';
import UsersController from 'src/controller/user/UsersController';
import { UserSearchResults } from 'src/components/profile/search/UserSearchResults';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import UserSearchResultObject from 'src/firebase/firestore/user/UserSearchResultObject';
import FollowerController from 'src/controller/follower/FollowerController';
import { getCurrentUserUid } from 'src/session/CurrentUserProvider';
import { useFocusEffect } from '@react-navigation/native';

export const UserSearch = () => {
    const { colors } = useTheme();

    const [searchText, setSearchText] = React.useState("");
    const [searchResults, setSearchResults] = React.useState<UserSearchResultObject | undefined>(undefined);
    const [followingUids, setFollowingUids] = React.useState<string[]>([]);

    const [currentUserId, setCurrentUserId] = React.useState<string | undefined>(undefined);
    React.useEffect(() => {
        getCurrentUserUid(setCurrentUserId);
    }, []);

    const onSearchChange = (text: string) => {
        const runDownSubQuery: boolean = text.includes(searchText);
        const runDownUpQuery: boolean = searchText.includes(text);

        setSearchText(text);

        if (text === "") {
            setSearchResults(undefined);

        } else if (searchResults && runDownSubQuery) {
            UsersController.getUsersByDisplayNameSubQuery(text, searchResults, (newResults: UserSearchResultObject) => {
                setSearchResults(newResults);
            });

        } else if (searchResults && runDownUpQuery) {
            setSearchResults(searchResults.parentSearch);

        } else {
            UsersController.getUsersByDisplayName(text, (results: UserSearchResultObject) => {
                setSearchResults(results);
            });
        }
    }

    const onFollowUser = (uid: string) => {
        if (currentUserId) {
            FollowerController.followUser(currentUserId, uid, () => { });
        }
        let followingUidsCopy = followingUids.slice(0);
        followingUidsCopy.push(uid);
        setFollowingUids(followingUidsCopy);
    }

    const onUnfollowUser = (uid: string) => {
        if (currentUserId) {
            FollowerController.unfollowUser(currentUserId, uid, () => { });
        }
        let followingUidsCopy = followingUids.slice(0);
        for (var i = followingUidsCopy.length - 1; i >= 0; i--) {
            if (followingUidsCopy[i] === uid) {
                followingUidsCopy.splice(i, 1);
                setFollowingUids(followingUidsCopy);
                return;
            }
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            if (currentUserId) {
                FollowerController.getFollowing(currentUserId, setFollowingUids);
            }
        }, [currentUserId])
    );

    return (
        <Screen>
            <Banner name='User Search' leftIcon={"arrow-back"} leftRoute="Timeline" />

            <View style={{ alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", width: "60%" }} >
                    <View style={{ position: "absolute", zIndex: 1, paddingTop: 30, paddingLeft: 18 }} >
                        <Ionicons name={'search'} size={22} color={colors.text} />
                    </View>
                    <TextInput
                        style={{ marginTop: 30, paddingLeft: 60, height: 40, width: "100%", borderColor: 'white', borderWidth: 1, borderRadius: 50, color: colors.text, fontSize: 20 }}
                        onChangeText={onSearchChange}
                        value={searchText}
                        placeholder={"enter search"}
                    />
                </View>
                <View style={{ paddingTop: 20, width: "100%" }}>
                    <HorizontalLine />
                    {searchResults?.results
                        ? <UserSearchResults followingUids={followingUids} onFollowUser={onFollowUser} onUnfollowUser={onUnfollowUser} searchResults={searchResults.results!} />
                        : <UserSearchResults followingUids={followingUids} onFollowUser={onFollowUser} onUnfollowUser={onUnfollowUser} searchResults={[]} />}
                </View>
            </View>
        </Screen>

    );
}