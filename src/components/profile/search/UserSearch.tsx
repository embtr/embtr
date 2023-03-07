import * as React from 'react';
import { ScrollView, TextInput, View, ViewStyle } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserSearchResults } from 'src/components/profile/search/UserSearchResults';
import UserSearchResultObject from 'src/firebase/firestore/user/UserSearchResultObject';
import FollowerController from 'src/controller/follower/FollowerController';
import { useFocusEffect } from '@react-navigation/native';
import { UserSearchUtility } from 'src/util/user/UserSearchUtility';
import { getAuth } from 'firebase/auth';
import { CARD_SHADOW, USER_SEARCH_WIDTH } from 'src/util/constants';

export const UserSearch = () => {
    const { colors } = useTheme();

    const [userSearchUtility, setUserSearchUtility] = React.useState<UserSearchUtility | undefined>(undefined);
    const [searchText, setSearchText] = React.useState('');

    const [searchResults, setSearchResults] = React.useState<UserSearchResultObject | undefined>(undefined);
    const [followingUids, setFollowingUids] = React.useState<string[]>([]);

    const onSearchChange = (text: string) => {
        setSearchText(text);
        if (userSearchUtility) {
            userSearchUtility.updateSearch(text, setSearchResults);
        }
    };

    const onFollowUser = (uid: string) => {
        let followingUidsCopy = followingUids.slice(0);
        followingUidsCopy.push(uid);
        setFollowingUids(followingUidsCopy);
    };

    const onUnfollowUser = (uid: string) => {
        let followingUidsCopy = followingUids.slice(0);
        for (var i = followingUidsCopy.length - 1; i >= 0; i--) {
            if (followingUidsCopy[i] === uid) {
                followingUidsCopy.splice(i, 1);
                setFollowingUids(followingUidsCopy);
                return;
            }
        }
    };

    React.useEffect(() => {
        setUserSearchUtility(new UserSearchUtility());
    }, []);

    React.useEffect(() => {
        onSearchChange('');
    }, [userSearchUtility]);

    useFocusEffect(
        React.useCallback(() => {
            FollowerController.getFollowing(getAuth().currentUser!.uid, setFollowingUids);
        }, [])
    );

    return (
        <Screen>
            <View style={{ paddingBottom: 20 }}>
                <Banner name="User Search" leftIcon={'arrow-back'} leftRoute="Timeline" />
            </View>

            <ScrollView>
                <View style={{ alignItems: 'center' }}>
                    <View
                        style={[
                            {
                                backgroundColor: colors.button_background,
                                height: 75,
                                borderRadius: 15,
                                width: USER_SEARCH_WIDTH,
                                flexDirection: 'row',
                                alignItems: 'center',
                            },
                            CARD_SHADOW,
                        ]}
                    >
                        <View
                            style={{
                                alignContent: 'flex-end',
                                alignItems: 'flex-end',
                                justifyContent: 'flex-end',
                                position: 'absolute',
                                zIndex: -1,
                                width: '100%',
                                paddingRight: 15,
                            }}
                        >
                            <Ionicons name={'search'} size={28} color={colors.search_preview} />
                        </View>

                        <TextInput
                            style={{
                                width: '100%',
                                height: '100%',
                                color: colors.user_search_name,
                                fontSize: 18,
                                fontFamily: 'Poppins_400Regular',
                                paddingLeft: 15,
                            }}
                            onChangeText={onSearchChange}
                            value={searchText}
                            placeholderTextColor={colors.search_preview}
                            placeholder={'Search'}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={{ paddingTop: 10, width: '100%' }}>
                        {searchResults?.results ? (
                            <UserSearchResults
                                followingUids={followingUids}
                                onFollowUser={onFollowUser}
                                onUnfollowUser={onUnfollowUser}
                                searchResults={searchResults.results!}
                            />
                        ) : (
                            <UserSearchResults followingUids={followingUids} onFollowUser={onFollowUser} onUnfollowUser={onUnfollowUser} searchResults={[]} />
                        )}
                    </View>
                </View>
            </ScrollView>
        </Screen>
    );
};
