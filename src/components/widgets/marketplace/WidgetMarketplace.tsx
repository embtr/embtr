import React from 'react';
import { TextInput, View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import UserController from 'src/controller/user/UserController';
import { Ionicons } from '@expo/vector-icons';
import { CARD_SHADOW } from 'src/util/constants';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { User, Widget, WidgetType } from 'resources/schema';
import { WidgetMarketplaceToggle } from './WidgetMarketplaceToggle';
import { WidgetController } from 'src/controller/widget/WidgetController';

export const WidgetMarketplace = () => {
    const { colors } = useTheme();

    const [user, setUser] = React.useState<User>();
    const [userWidgets, setUserWidgets] = React.useState<Widget[]>([]);
    const [searchText, setSearchText] = React.useState<string>('');

    const fetchUser = async () => {
        const user = await UserController.getCurrentUser();
        if (user.user) {
            setUser(user.user);
        }
    };

    const fetchUserWidgets = async () => {
        const userWidgets = await WidgetController.get();
        setUserWidgets(userWidgets);
    };

    React.useEffect(() => {
        fetchUser();
        fetchUserWidgets();
    }, []);

    const onAddWidget = async (type: string) => {
        const widgetType: WidgetType = WidgetType[type as keyof typeof WidgetType];
        const widget: Widget = {
            type: widgetType,
            order: userWidgets.length,
        };

        const clone = [...userWidgets];
        clone.push(widget);
        await WidgetController.update(clone);

        fetchUserWidgets();
    };

    const getWidgetView = (widgetType: string, name: string, description: string, isEnabled: boolean, onToggle: Function) => {
        return (
            <View key={name} style={{ paddingTop: 5, width: '100%' }}>
                <WidgetMarketplaceToggle
                    name={name}
                    description={description}
                    isEnabled={isEnabled}
                    onToggle={() => {
                        onToggle(widgetType);
                    }}
                />
            </View>
        );
    };

    const getCleanWidgetName = (type: string) => {
        const typeName = type.toString();
        const widgetName = typeName
            .toLowerCase()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());

        return widgetName;
    };

    const widgetMatchesFilter = (widgetName: string) => {
        return searchText === '' || widgetName.toLowerCase().includes(searchText.toLowerCase());
    };

    const getWidgetsToDisplay = () => {
        let widgetViews: JSX.Element[] = [];
        for (const type in WidgetType) {
            const widgetName = getCleanWidgetName(type);
            if (!widgetMatchesFilter(widgetName)) {
                continue;
            }

            const widget = userWidgets.find((w) => w.type === type);
            if (widget) {
                widgetViews.push(getWidgetView(type, widgetName, 'this is a desc', true, onAddWidget));
            } else {
                widgetViews.push(getWidgetView(type, widgetName, 'this is a desc', false, onAddWidget));
            }
        }

        return widgetViews;
    };

    const widgetViews = getWidgetsToDisplay();

    return (
        <Screen>
            <Banner name="Widget Marketplace" leftText="back" leftRoute="BACK" />

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
                            onChangeText={setSearchText}
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
                    <View style={{ height: 7 }} />
                </View>
            </ScrollView>
        </Screen>
    );
};
