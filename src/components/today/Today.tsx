import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import PlannedDayController, { getTodayKey, PlannedDay } from 'src/controller/planning/PlannedDayController';
import DailyResultController, { DailyResultModel } from 'src/controller/timeline/daily_result/DailyResultController';
import { wait } from 'src/util/GeneralUtility';
import { Banner } from '../common/Banner';
import { EmbtrMenuCustom } from '../common/menu/EmbtrMenuCustom';
import { createEmbtrMenuOptions, EmbtrMenuOption } from '../common/menu/EmbtrMenuOption';
import { Screen } from '../common/Screen';
import { TodaysCountdownWidget } from '../widgets/TodaysCountdownWidget';
import { TodaysPhotosWidget } from '../widgets/TodaysPhotosWidget';
import { TodaysTasksWidget } from '../widgets/TodaysTasksWidget';
import { StackNavigationProp } from '@react-navigation/stack';
import { TodayTab } from 'src/navigation/RootStackParamList';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu, getCurrentUser } from 'src/redux/user/GlobalState';
import UserController, { UserModel } from 'src/controller/user/UserController';
import {
    DAILY_HISTORY_WIDGET,
    QUOTE_OF_THE_DAY_WIDGET,
    TIME_LEFT_IN_DAY_WIDGET,
    TODAYS_NOTES_WIDGET,
    TODAYS_PHOTOS_WIDGET,
    TODAYS_TASKS_WIDGET,
    WIDGETS,
} from 'src/util/constants';
import { TodaysNotesWidget } from '../widgets/TodaysNotesWidget';
import { QuoteOfTheDayWidget } from '../widgets/quote_of_the_day/QuoteOfTheDayWidget';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { WigglableView } from '../common/animated_view/WigglableView';
import { DeletableView } from '../common/animated_view/DeletableView';
import { DailyHistoryWidget } from '../widgets/daily_history/DailyHistoryWidget';
import PlannedTaskController, { clonePlannedTaskModel, PlannedTaskModel } from 'src/controller/planning/PlannedTaskController';
import { RefreshControl } from 'react-native-gesture-handler';
import { User } from 'resources/schema';

export const Today = () => {
    const [refreshedTimestamp, setRefreshedTimestamp] = React.useState<Date>();
    const [refreshing, setRefreshing] = React.useState(false);
    const [dailyResult, setDailyResult] = React.useState<DailyResultModel>();
    const [plannedDay, setPlannedDay] = React.useState<PlannedDay>();
    const [user, setUser] = React.useState<UserModel>();
    const [widgets, setWidgets] = React.useState<string[]>([]);
    const [isConfiguringWidgets, setIsConfiguringWidgets] = React.useState<boolean>(false);
    const [newCurrentUser, setNewCurrentUser] = React.useState<User>();

    const navigation = useNavigation<StackNavigationProp<TodayTab>>();

    const todayKey = getTodayKey();

    React.useEffect(() => {
        setRefreshedTimestamp(new Date());
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchPlannedDay();
        }, [])
    );

    React.useEffect(() => {
        fetchDailyResult();
    }, [plannedDay]);

    const fetchNewCurrentUser = async () => {
        const newCurrentUser = await UserController.getNewCurrentUser();
        if (!newCurrentUser.user) {
            return;
        }

        setNewCurrentUser(newCurrentUser.user);
    };

    React.useEffect(() => {
        fetchUser();
        fetchNewCurrentUser();
    }, []);

    const currentUser = useAppSelector(getCurrentUser);

    // may want to just directly call both to guarentee
    // upon refresh that we have all new data
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchPlannedDay();
        wait(500).then(() => {
            setRefreshing(false);
            setRefreshedTimestamp(new Date());
        });
    }, []);

    const fetchPlannedDay = async () => {
        const plannedDay = await PlannedDayController.get(currentUser, todayKey);
        setPlannedDay(plannedDay);
    };

    const fetchDailyResult = async () => {
        if (plannedDay) {
            const foundDailyResult = await DailyResultController.getOrCreate(plannedDay);
            setDailyResult(foundDailyResult);
        }
    };

    const fetchUser = async () => {
        const user = await UserController.getCurrentUser();
        if (!user) {
            return;
        }

        if (!user.today_widgets) {
            setWidgets(WIDGETS);
        } else {
            setWidgets(user.today_widgets);
        }
        setUser(user);
    };

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

    const togglePlannedTaskStatus = async (plannedTask: PlannedTaskModel, currentStatus: string, fastStatusUpdate: Function) => {
        if (!plannedDay) {
            return;
        }

        let newStatus = 'INCOMPLETE';
        if (currentStatus === 'COMPLETE') {
            newStatus = 'FAILED';
        } else if (currentStatus === 'INCOMPLETE') {
            newStatus = 'COMPLETE';
        }

        fastStatusUpdate(newStatus);

        let clonedPlannedTask: PlannedTaskModel = clonePlannedTaskModel(plannedTask);
        clonedPlannedTask.status = newStatus;

        await PlannedTaskController.update(currentUser, clonedPlannedTask);
        fetchPlannedDay();
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

    const updateWidgetOrdering = () => {
        if (!user) {
            return;
        }

        let clonedUser = UserController.clone(user);
        clonedUser.today_widgets = widgets;
        UserController.update(clonedUser);
        setUser(clonedUser);
    };

    const removeWidget = (widgetToDelete: string) => {
        if (!user) {
            return;
        }

        let clonedUser = UserController.clone(user);
        clonedUser.today_widgets = [];
        if (user.today_widgets) {
            for (const widget of user.today_widgets) {
                if (widget !== widgetToDelete) {
                    clonedUser.today_widgets.push(widget);
                }
            }
        }
        UserController.update(clonedUser);
        setWidgets(clonedUser.today_widgets);
        setUser(clonedUser);
    };

    const renderItem = ({ item, drag }: RenderItemParams<string>) => {
        return (
            <ScaleDecorator>
                <TouchableOpacity onLongPress={drag} disabled={!isConfiguringWidgets || item == 'SPACER'}>
                    {/* Today Countdown */}
                    {item === TIME_LEFT_IN_DAY_WIDGET && plannedDay && user.today_widgets?.includes(TIME_LEFT_IN_DAY_WIDGET) && (
                        <WigglableView key={TIME_LEFT_IN_DAY_WIDGET} wiggle={isConfiguringWidgets}>
                            <DeletableView
                                visible={isConfiguringWidgets}
                                onPress={() => {
                                    removeWidget(TIME_LEFT_IN_DAY_WIDGET);
                                }}
                            >
                                <TodaysCountdownWidget plannedDay={plannedDay} />
                            </DeletableView>
                        </WigglableView>
                    )}

                    {/* QUOTE OF THE DAY WIDGET */}
                    {item === QUOTE_OF_THE_DAY_WIDGET && user.today_widgets?.includes(QUOTE_OF_THE_DAY_WIDGET) && refreshedTimestamp && (
                        <WigglableView key={QUOTE_OF_THE_DAY_WIDGET} wiggle={isConfiguringWidgets}>
                            <DeletableView
                                visible={isConfiguringWidgets}
                                onPress={() => {
                                    removeWidget(QUOTE_OF_THE_DAY_WIDGET);
                                }}
                            >
                                <QuoteOfTheDayWidget refreshedTimestamp={refreshedTimestamp} />
                            </DeletableView>
                        </WigglableView>
                    )}

                    {/* TODAY'S TASKS WIDGET */}
                    {item === TODAYS_TASKS_WIDGET && plannedDay && dailyResult && newCurrentUser && user.today_widgets?.includes(TODAYS_TASKS_WIDGET) && (
                        <WigglableView key={TODAYS_TASKS_WIDGET} wiggle={isConfiguringWidgets}>
                            <DeletableView
                                visible={isConfiguringWidgets}
                                onPress={() => {
                                    removeWidget(TODAYS_TASKS_WIDGET);
                                }}
                            >
                                <TodaysTasksWidget user={newCurrentUser} />
                            </DeletableView>
                        </WigglableView>
                    )}

                    {/* TODAY'S NOTES WIDGET */}
                    {item === TODAYS_NOTES_WIDGET && user.today_widgets?.includes(TODAYS_NOTES_WIDGET) && (
                        <WigglableView key={TODAYS_NOTES_WIDGET} wiggle={isConfiguringWidgets}>
                            <DeletableView
                                visible={isConfiguringWidgets}
                                onPress={() => {
                                    removeWidget(TODAYS_NOTES_WIDGET);
                                }}
                            >
                                <TodaysNotesWidget />
                            </DeletableView>
                        </WigglableView>
                    )}

                    {/* TODAY'S PHOTOS WIDGET */}
                    {item === TODAYS_PHOTOS_WIDGET && plannedDay && dailyResult && user.today_widgets?.includes(TODAYS_PHOTOS_WIDGET) && (
                        <WigglableView key={TODAYS_PHOTOS_WIDGET} wiggle={isConfiguringWidgets}>
                            <DeletableView
                                visible={isConfiguringWidgets}
                                onPress={() => {
                                    removeWidget(TODAYS_PHOTOS_WIDGET);
                                }}
                            >
                                <TodaysPhotosWidget dailyResult={dailyResult} onImagesChanged={fetchDailyResult} />
                            </DeletableView>
                        </WigglableView>
                    )}

                    {/* DAILY HISTORY WIDGET */}
                    {item === DAILY_HISTORY_WIDGET && refreshedTimestamp && user.today_widgets?.includes(DAILY_HISTORY_WIDGET) && newCurrentUser?.id && (
                        <WigglableView key={DAILY_HISTORY_WIDGET} wiggle={isConfiguringWidgets}>
                            <DeletableView
                                visible={isConfiguringWidgets}
                                onPress={() => {
                                    removeWidget(DAILY_HISTORY_WIDGET);
                                }}
                            >
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

                <DraggableFlatList
                    style={{ height: '100%', marginBottom: 100 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    data={addSpacerToWidgets(widgets)}
                    onDragEnd={({ data }) => {
                        updateWidgetsWithoutSpacer(data);
                    }}
                    keyExtractor={(item) => item}
                    renderItem={renderItem}
                />
            </View>
        </Screen>
    );
};
