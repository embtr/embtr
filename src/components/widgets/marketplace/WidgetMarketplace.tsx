import { TextInput, View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import React from 'react';
import UserController, { UserModel } from 'src/controller/user/UserController';
import { Ionicons } from '@expo/vector-icons';
import { CARD_SHADOW, WIDGETS } from 'src/util/constants';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { getWidgets } from './WidgetMarketplaceProvider';

export const WidgetMarketplace = () => {
    const [user, setUser] = React.useState<UserModel>();
    const { colors } = useTheme();
    const [searchText, setSearchText] = React.useState<string>('');

    React.useEffect(() => {
        const fetch = async () => {
            const user = await UserController.getCurrentUser();
            setUser(user);
        };

        fetch();
    }, []);

    const onSearchChange = (text: string) => {
        setSearchText(text);
    };

    const onToggle = (name: string, enabled: boolean) => {
        if (!user) {
            return;
        }

        let enabledWidgets: string[] = [];
        WIDGETS.forEach((widget) => {
            if (widget === name) {
                if (enabled) {
                    enabledWidgets.push(name);
                }
            } else if (user.today_widgets?.includes(widget)) {
                enabledWidgets.push(widget);
            }
        });

        let clonedUser = UserController.clone(user);
        clonedUser.today_widgets = enabledWidgets;
        UserController.update(clonedUser);
        setUser(clonedUser);
    };

    const isEnabled = (name: string) => {
        return user?.today_widgets?.includes(name) === true;
    };

    let widgetViews: JSX.Element[] = getWidgets(searchText, isEnabled, onToggle);

    return (
        <Screen>
            <Banner name="Widget Marketplace" rightText={'close'} rightRoute="BACK" />

            <ScrollView>
                {/* SEARCH BAR */}
                <View style={{ paddingTop: 10, width: '100%', alignItems: 'center' }}>
                    <View
                        style={[
                            {
                                backgroundColor: colors.button_background,
                                height: 75,
                                borderRadius: 15,
                                width: '97%',
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
                                height: 100,
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
                </View>

                {/* WIDGETS */}
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <View style={{ paddingTop: 5, width: '100%' }} />
                    {widgetViews}
                </View>
            </ScrollView>
        </Screen>
    );
};
