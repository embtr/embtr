import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, View, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { FollowUserButton } from 'src/components/profile/FollowUserButton';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { CARD_SHADOW, USER_SEARCH_WIDTH } from 'src/util/constants';
import { User } from 'resources/schema';

type userProfileScreenProp = StackNavigationProp<TimelineTabScreens, 'UserProfile'>;

interface Props {
    user: User;
}

export const UserSearchResult = ({ user }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<userProfileScreenProp>();

    return (
        <View style={{ width: '100%', alignItems: 'center' }}>
            <TouchableOpacity
                style={{ width: USER_SEARCH_WIDTH }}
                onPress={() => {
                    navigation.navigate('UserProfile', { id: user?.uid ? user.uid : '' });
                }}
            >
                <View
                    style={[
                        {
                            backgroundColor: colors.button_background,
                            alignItems: 'center',
                            height: 75,
                            borderRadius: 15,
                            width: '100%',
                            flexDirection: 'row',
                            paddingLeft: 20,
                        },
                        CARD_SHADOW,
                    ]}
                >
                    <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                        <NavigatableUserImage user={user} size={35} />
                        <Text
                            style={{
                                fontFamily: 'Poppins_500Medium',
                                fontSize: 15,
                                color: colors.user_search_name,
                                paddingLeft: 10,
                            }}
                        >
                            {user.displayName}
                        </Text>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            alignContent: 'center',
                            alignItems: 'flex-end',
                            paddingRight: 15,
                        }}
                    >
                        {/*<View style={{ width: 100 }}>
                            <FollowUserButton
                                userProfileModel={userProfileModel}
                                onFollowUser={onFollowUser}
                                onUnfollowUser={onUnfollowUser}
                                following={following}
                            />
                        </View>
                    */}
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};
