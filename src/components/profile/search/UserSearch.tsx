import * as React from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, USER_SEARCH_WIDTH } from 'src/util/constants';
import { User } from 'resources/schema';
import UserController from 'src/controller/user/UserController';
import { UserSearchResult } from './UserSearchResult';
import { ModelKeyGenerator } from 'src/util/model/ModelKeyGenerator';

export const UserSearch = () => {
    const { colors } = useTheme();

    const [searchText, setSearchText] = React.useState('');
    const [users, setUsers] = React.useState<User[]>([]);

    const onSearchChange = async (text: string) => {
        setSearchText(text);

        const newUsers = await UserController.search(text);
        setUsers(newUsers);
    };

    const userViews: JSX.Element[] = [];
    for (const user of users) {
        const key = ModelKeyGenerator.generateUserKey(user);
        userViews.push(
            <View style={{ paddingTop: 5, width: '100%' }} key={key}>
                <UserSearchResult user={user} />
            </View>
        );
    }

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

                    <View style={{ paddingTop: 10, width: '100%' }}>{userViews}</View>
                </View>
            </ScrollView>
        </Screen>
    );
};
