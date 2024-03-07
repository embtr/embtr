import { View } from 'react-native';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { TimelineTab } from 'src/components/navigation/TimelineTab';
import { ProfileTab } from 'src/components/navigation/ProfileTab';
import { CommonActions } from '@react-navigation/native';
import { TodayTab } from 'src/components/today/TodayTab';
import { TabBar } from 'src/components/home/tabmenu/TabBar';
import { useAppDispatch } from 'src/redux/Hooks';
import { setCurrentTab } from 'src/redux/user/GlobalState';
import { PlanningTab } from 'src/components/challenge/PlanningTab';
import React from 'react';
import { OnLoginHooks } from 'src/hooks/OnLoginHooks';
import { MyHabits } from '../manage_habits/MyHabits';
import { MyHabitsTab } from '../manage_habits/MyHabitsTab';
import { JourneyTab } from '../journey/JourneyTab';

const Tab = createBottomTabNavigator();

export const TABS = {
    TIMELINE: 'TimelineTab',
    MY_HABITS: 'MyHabitsTab',
    TODAY: 'TodayTab',
    PLAN: 'PlanTab',
    JOURNEY: 'JourneyTab',
    USER_PROFILE: 'CurrentUserTab',
};

export const Dashboard = () => {
    const dispatch = useAppDispatch();

    OnLoginHooks.useOnLogin();

    React.useEffect(() => {
        dispatch(setCurrentTab(TABS.TODAY));
    }, []);

    return (
        <View style={{ flex: 1, overflow: isDesktopBrowser() ? 'hidden' : undefined }}>
            <Tab.Navigator
                initialRouteName={TABS.TODAY}
                sceneContainerStyle={{ backgroundColor: 'green' }}
                tabBar={(props: BottomTabBarProps) => <TabBar {...props} />}
                screenOptions={() => ({
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: false,
                    headerShown: false,
                    //                    , lazy:false - this will load all tabs rather than one at a time
                })}
            >
                <Tab.Screen
                    name={TABS.TIMELINE}
                    listeners={({ navigation, route }) => ({
                        tabPress: (e) => {
                            dispatch(setCurrentTab(TABS.TIMELINE));

                            const currentlyInFocus = navigation.isFocused();
                            if (
                                currentlyInFocus &&
                                route &&
                                route.state &&
                                route.state.routes.length >= 1 &&
                                route.state.routes[0]['name'] !== 'Timeline'
                            ) {
                                e.preventDefault();
                                navigation.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{ name: 'Timeline' }],
                                    })
                                );
                            }
                        },
                    })}
                    component={TimelineTab}
                />

                <Tab.Screen
                    name={TABS.MY_HABITS}
                    listeners={({ navigation, route }) => ({
                        tabPress: (e) => {
                            dispatch(setCurrentTab(TABS.TODAY));

                            const currentlyInFocus = navigation.isFocused();
                            if (
                                currentlyInFocus &&
                                route &&
                                route.state &&
                                route.state.routes.length >= 1 &&
                                route.state.routes[0]['name'] !== 'Today'
                            ) {
                                e.preventDefault();
                                navigation.dispatch(
                                    CommonActions.reset({ index: 0, routes: [{ name: 'Today' }] })
                                );
                            }
                        },
                    })}
                    component={MyHabitsTab}
                />

                <Tab.Screen
                    name={TABS.TODAY}
                    listeners={({ navigation, route }) => ({
                        tabPress: (e) => {
                            dispatch(setCurrentTab(TABS.TODAY));

                            const currentlyInFocus = navigation.isFocused();
                            if (
                                currentlyInFocus &&
                                route &&
                                route.state &&
                                route.state.routes.length >= 1 &&
                                route.state.routes[0]['name'] !== 'Today'
                            ) {
                                e.preventDefault();
                                navigation.dispatch(
                                    CommonActions.reset({ index: 0, routes: [{ name: 'Today' }] })
                                );
                            }
                        },
                    })}
                    component={TodayTab}
                />

                <Tab.Screen
                    name={TABS.JOURNEY}
                    listeners={({ navigation, route }) => ({
                        tabPress: (e) => {
                            dispatch(setCurrentTab(TABS.PLAN));

                            const currentlyInFocus = navigation.isFocused();
                            if (
                                currentlyInFocus &&
                                route &&
                                route.state &&
                                route.state.routes.length >= 1 &&
                                route.state.routes[0]['name'] !== 'PlanningMain'
                            ) {
                                e.preventDefault();
                                navigation.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{ name: 'PlanningMain' }],
                                    })
                                );
                            }
                        },
                    })}
                    component={JourneyTab}
                />

                <Tab.Screen
                    name={TABS.USER_PROFILE}
                    listeners={({ navigation, route }) => ({
                        tabPress: (e) => {
                            dispatch(setCurrentTab(TABS.USER_PROFILE));

                            const currentlyInFocus = navigation.isFocused();
                            if (
                                currentlyInFocus &&
                                route &&
                                route.state &&
                                route.state.routes.length >= 1 &&
                                route.state.routes[0]['name'] !== 'Profile'
                            ) {
                                e.preventDefault();
                                navigation.dispatch(
                                    CommonActions.reset({ index: 0, routes: [{ name: 'Profile' }] })
                                );
                            }
                        },
                    })}
                    component={ProfileTab}
                />
            </Tab.Navigator>
        </View>
    );
};
