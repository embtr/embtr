import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, TouchableOpacity } from 'react-native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView, RefreshControl } from 'react-native-gesture-handler';
import { User, Widget, WidgetType } from 'resources/schema';
import UserController from 'src/controller/user/UserController';
import { TodayTab } from 'src/navigation/RootStackParamList';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';
import { wait } from 'src/util/GeneralUtility';
import { Banner } from '../common/Banner';
import { Screen } from '../common/Screen';
import { DeletableView } from '../common/animated_view/DeletableView';
import { WigglableView } from '../common/animated_view/WigglableView';
import { EmbtrMenuCustom } from '../common/menu/EmbtrMenuCustom';
import { EmbtrMenuOption, createEmbtrMenuOptions } from '../common/menu/EmbtrMenuOption';
import { TodaysCountdownWidget } from '../widgets/TodaysCountdownWidget';
import { TodaysNotesWidget } from '../widgets/TodaysNotesWidget';
import { TodaysTasksWidget } from '../widgets/TodaysTasksWidget';
import { DailyHistoryWidget } from '../widgets/daily_history/DailyHistoryWidget';
import { QuoteOfTheDayWidget } from '../widgets/quote_of_the_day/QuoteOfTheDayWidget';
import { WidgetController } from 'src/controller/widget/WidgetController';

export const Today = () => {
    const [refreshedTimestamp, setRefreshedTimestamp] = React.useState<Date>();
    const [refreshing, setRefreshing] = React.useState(false);
    const [widgets, setWidgets] = React.useState<Widget[]>([]);
    const [isConfiguringWidgets, setIsConfiguringWidgets] = React.useState<boolean>(false);
    const [user, setUser] = React.useState<User>();

    const navigation = useNavigation<StackNavigationProp<TodayTab>>();

    const fetch = async () => {
        let widgets = await WidgetController.get();
        //sort by order
        widgets.sort((a, b) => {
            return (a.order ?? 0) - (b.order ?? 0);
        });
        if (widgets.length === 0) {
            widgets = WidgetController.getDefaults();
        }

        setWidgets(widgets);
    };

    React.useEffect(() => {
        fetch();
    }, []);

    React.useEffect(() => {
        setRefreshedTimestamp(new Date());
    }, []);

    const fetchNewCurrentUser = async () => {
        const newCurrentUser = await UserController.getCurrentUser();
        if (!newCurrentUser.user) {
            return;
        }

        setUser(newCurrentUser.user);
    };

    React.useEffect(() => {
        fetchNewCurrentUser();
    }, []);

    // may want to just directly call both to guarentee
    // upon refresh that we have all new data
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(500).then(() => {
            setRefreshing(false);
            setRefreshedTimestamp(new Date());
        });
    }, []);

    const removeWidget = (widget: Widget) => {
        let clone = [...widgets];
        const index = clone.indexOf(widget);
        if (index > -1) {
            clone.splice(index, 1);
        }

        setWidgets(clone);
    };

    const closeMenu = useAppSelector(getCloseMenu);
    const menuOptions: EmbtrMenuOption[] = [
        {
            name: 'Widget Marketplace',
            onPress: () => {
                navigation.navigate('WidgetMarketplace');
                closeMenu();
            },
        },
        {
            name: 'Configure',
            onPress: () => {
                if (!isConfiguringWidgets) {
                    setIsConfiguringWidgets(true);
                } else {
                    setIsConfiguringWidgets(false);
                }
                closeMenu();
            },
        },
    ];

    if (!user) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    const updateWidgetOrdering = async () => {
        if (!user) {
            return;
        }

        await WidgetController.update(widgets);
        await fetch();
    };

    const getWidgetFromType = (type: WidgetType) => {
        switch (type) {
            case WidgetType.TIME_LEFT_IN_DAY:
                return <TodaysCountdownWidget />;

            case WidgetType.TODAYS_TASKS:
                return <TodaysTasksWidget user={user} />;

            case WidgetType.TODAYS_NOTES:
                return <TodaysNotesWidget />;

            case WidgetType.QUOTE_OF_THE_DAY:
                return <QuoteOfTheDayWidget refreshedTimestamp={refreshedTimestamp!} />;

            case WidgetType.DAILY_HISTORY:
                return <DailyHistoryWidget userId={user.id!} />;
        }

        return <View />;
    };

    const renderItem = ({ item, drag }: RenderItemParams<Widget>) => {
        return (
            <ScaleDecorator>
                <TouchableOpacity onLongPress={drag} disabled={!isConfiguringWidgets}>
                    <WigglableView key={item.type} wiggle={isConfiguringWidgets}>
                        <DeletableView
                            visible={isConfiguringWidgets}
                            onPress={() => {
                                removeWidget(item);
                            }}
                        >
                            {getWidgetFromType(item.type!)}
                        </DeletableView>
                    </WigglableView>
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };

    return (
        <Screen>
            <EmbtrMenuCustom />
            <View style={{ height: '100%', width: '100%' }}>
                <Banner
                    name="Today"
                    rightText={isConfiguringWidgets ? 'done' : undefined}
                    rightOnClick={
                        isConfiguringWidgets
                            ? () => {
                                  updateWidgetOrdering();
                                  setIsConfiguringWidgets(false);
                              }
                            : undefined
                    }
                    rightIcon={!isConfiguringWidgets ? 'ellipsis-horizontal' : undefined}
                    menuOptions={!isConfiguringWidgets ? createEmbtrMenuOptions(menuOptions) : undefined}
                />

                <GestureHandlerRootView>
                    <DraggableFlatList
                        style={{ height: '100%', marginBottom: 100 }}
                        refreshControl={<RefreshControl enabled={!isConfiguringWidgets} refreshing={refreshing} onRefresh={onRefresh} />}
                        data={widgets}
                        onDragEnd={({ data }) => {
                            setWidgets(data);
                        }}
                        keyExtractor={(item) => item.type!}
                        renderItem={renderItem}
                    />
                </GestureHandlerRootView>
            </View>
        </Screen>
    );
};
