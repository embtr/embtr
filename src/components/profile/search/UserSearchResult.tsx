import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, View, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import {
    CARD_SHADOW,
    PADDING_LARGE,
    PADDING_SMALL,
    POPPINS_MEDIUM,
    USER_SEARCH_WIDTH,
} from 'src/util/constants';
import { User } from 'resources/schema';
import { BadgeBelt } from 'src/components/common/badge/BadgeBelt';

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
                            backgroundColor: colors.card_background,
                            alignItems: 'center',
                            borderRadius: 9,
                            paddingVertical: PADDING_LARGE,
                            flexDirection: 'row',
                            paddingLeft: PADDING_LARGE,
                        },
                        CARD_SHADOW,
                    ]}
                >
                    <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                        <NavigatableUserImage user={user} size={35} />
                        <Text
                            style={{
                                fontFamily: POPPINS_MEDIUM,
                                fontSize: 15,
                                color: colors.user_search_name,
                                paddingLeft: PADDING_LARGE,
                            }}
                        >
                            {user.displayName}
                        </Text>
                        <View style={{ paddingLeft: PADDING_SMALL / 2 }}>
                            <BadgeBelt user={user} size={15} />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};
