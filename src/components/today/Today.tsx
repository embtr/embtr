import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView, RefreshControl } from 'react-native-gesture-handler';
import { User } from 'resources/schema';
import UserController from 'src/controller/user/UserController';
import { TodayTab } from 'src/navigation/RootStackParamList';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';
import { wait } from 'src/util/GeneralUtility';
import { DAILY_HISTORY_WIDGET, QUOTE_OF_THE_DAY_WIDGET, TIME_LEFT_IN_DAY_WIDGET, TODAYS_NOTES_WIDGET, TODAYS_TASKS_WIDGET, WIDGETS } from 'src/util/constants';
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

export const Today = () => {
    const [refreshedTimestamp, setRefreshedTimestamp] = React.useState<Date>();
    const [refreshing, setRefreshing] = React.useState(false);
    const [widgets, setWidgets] = React.useState<string[]>([]);
    const [isConfiguringWidgets, setIsConfiguringWidgets] = React.useState<boolean>(false);
    const [newCurrentUser, setNewCurrentUser] = React.useState<User>();

    const navigation = useNavigation<StackNavigationProp<TodayTab>>();

    React.useEffect(() => {
        setRefreshedTimestamp(new Date());
    }, []);

    const fetchNewCurrentUser = async () => {
        const newCurrentUser = await UserController.getNewCurrentUser();
        if (!newCurrentUser.user) {
            return;
        }

        setNewCurrentUser(newCurrentUser.user);
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

    const addSpacerToWidgets = (widgets: string[]) => {
        let clone = [...widgets];
        clone.push('SPACER');

        return clone;
    };

    const updateWidgetsWithoutSpacer = (newWidgets: string[]) => {
        let cleansedWidgets: string[] = [];

        for (const widget of newWidgets) {
            if ('SPACER' !== widget) {
                cleansedWidgets.push(widget);
            }
        }

        setWidgets(cleansedWidgets);
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

    if (!newCurrentUser) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    const updateWidgetOrdering = () => {
        if (!newCurrentUser) {
            return;
        }
    };

    const renderItem = ({ item, drag }: RenderItemParams<string>) => {
        return (
            <ScaleDecorator>
                <TouchableOpacity onLongPress={drag} disabled={!isConfiguringWidgets || item == 'SPACER'}>
                    {/* Today Countdown */}
                    {item === TIME_LEFT_IN_DAY_WIDGET && (
                        <WigglableView key={TIME_LEFT_IN_DAY_WIDGET} wiggle={isConfiguringWidgets}>
                            <DeletableView visible={isConfiguringWidgets} onPress={() => {}}>
                                <TodaysCountdownWidget />
                            </DeletableView>
                        </WigglableView>
                    )}

                    {/* QUOTE OF THE DAY WIDGET */}
                    {item === QUOTE_OF_THE_DAY_WIDGET && refreshedTimestamp && (
                        <WigglableView key={QUOTE_OF_THE_DAY_WIDGET} wiggle={isConfiguringWidgets}>
                            <DeletableView visible={isConfiguringWidgets} onPress={() => {}}>
                                <QuoteOfTheDayWidget refreshedTimestamp={refreshedTimestamp} />
                            </DeletableView>
                        </WigglableView>
                    )}

                    {/* TODAY'S TASKS WIDGET */}
                    {item === TODAYS_TASKS_WIDGET && newCurrentUser && (
                        <WigglableView key={TODAYS_TASKS_WIDGET} wiggle={isConfiguringWidgets}>
                            <DeletableView visible={isConfiguringWidgets} onPress={() => {}}>
                                <TodaysTasksWidget user={newCurrentUser} />
                            </DeletableView>
                        </WigglableView>
                    )}

                    {/* TODAY'S NOTES WIDGET */}
                    {item === TODAYS_NOTES_WIDGET && (
                        <WigglableView key={TODAYS_NOTES_WIDGET} wiggle={isConfiguringWidgets}>
                            <DeletableView visible={isConfiguringWidgets} onPress={() => {}}>
                                <TodaysNotesWidget />
                            </DeletableView>
                        </WigglableView>
                    )}

                    {/* DAILY HISTORY WIDGET */}
                    {item === DAILY_HISTORY_WIDGET && refreshedTimestamp && newCurrentUser?.id && (
                        <WigglableView key={DAILY_HISTORY_WIDGET} wiggle={isConfiguringWidgets}>
                            <DeletableView visible={isConfiguringWidgets} onPress={() => {}}>
                                <DailyHistoryWidget userId={newCurrentUser.id} />
                            </DeletableView>
                        </WigglableView>
                    )}

                    {item === 'SPACER' && <View key={'SPACER'} style={{ height: 45, width: '100%' }} />}
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
                        data={addSpacerToWidgets(WIDGETS)}
                        onDragEnd={({ data }) => {
                            updateWidgetsWithoutSpacer(data);
                        }}
                        keyExtractor={(item) => item}
                        renderItem={renderItem}
                    />
                </GestureHandlerRootView>
            </View>
        </Screen>
    );
};
