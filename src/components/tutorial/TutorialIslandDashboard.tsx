import React from 'react';
import { View } from 'react-native';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { CommonActions } from '@react-navigation/native';
import { useAppDispatch } from 'src/redux/Hooks';
import { setCurrentTab } from 'src/redux/user/GlobalState';
import { TutorialIslandTabBar } from './TutorialIslandTabBar';
import { TutorialIslandTodayTab } from './navigation/tabs/TutorialIslandTodayTab';
import { TutorialIslandMyHabitsTab } from './navigation/tabs/TutorialIslandMyHabitsTab';
import { TutorialIslandTimelineTab } from './navigation/tabs/TutorialIslandTimelineTab';
import { TutorialIslandMyJourneyTab } from './navigation/tabs/TutorialIslandJourneyTab';
import { TutorialIslandProfileTab } from './navigation/tabs/TutorialIslandProfileTab';
import { TutorialIslandRoutes } from 'src/navigation/RootStackParamList';
import { OnLoginHooks } from 'src/hooks/OnLoginHooks';

const Tab = createBottomTabNavigator();

export const TUTORIAL_TIMELINE_TABS = {
    TIMELINE: TutorialIslandRoutes.TUTORIAL_ISLAND_TIMELINE,
    MY_HABITS: TutorialIslandRoutes.TUTORIAL_ISLAND_MY_HABITS_TAB,
    TODAY: TutorialIslandRoutes.TUTORIAL_ISLAND_TODAY,
    PLAN: TutorialIslandRoutes.TUTORIAL_ISLAND_PLAN,
    JOURNEY: TutorialIslandRoutes.TUTORIAL_ISLAND_JOURNEY,
    USER_PROFILE: TutorialIslandRoutes.TUTORIAL_ISLAND_CURRENT_USER,
};

export const TutorialIslandDashboard = () => {
    const dispatch = useAppDispatch();

    OnLoginHooks.useOnLogin();

    return (
        <View style={{ flex: 1, overflow: isDesktopBrowser() ? 'hidden' : undefined }}>
            <Tab.Navigator
                initialRouteName={TUTORIAL_TIMELINE_TABS.TODAY}
                tabBar={(props: BottomTabBarProps) => <TutorialIslandTabBar {...props} />}
                screenOptions={() => ({
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: false,
                    headerShown: false,
                    //                    , lazy:false - this will load all tabs rather than one at a time
                })}
            >
                <Tab.Screen
                    name={TUTORIAL_TIMELINE_TABS.TIMELINE}
                    listeners={({ navigation, route }) => ({
                        tabPress: (e) => {
                            dispatch(setCurrentTab(TUTORIAL_TIMELINE_TABS.TIMELINE));

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
                    component={TutorialIslandTimelineTab}
                />

                <Tab.Screen
                    name={TUTORIAL_TIMELINE_TABS.MY_HABITS}
                    listeners={({ navigation, route }) => ({
                        tabPress: (e) => {
                            dispatch(setCurrentTab(TUTORIAL_TIMELINE_TABS.MY_HABITS));

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
                    component={TutorialIslandMyHabitsTab}
                />

                <Tab.Screen
                    name={TUTORIAL_TIMELINE_TABS.TODAY}
                    listeners={({ navigation, route }) => ({
                        tabPress: (e) => {
                            dispatch(setCurrentTab(TUTORIAL_TIMELINE_TABS.TODAY));

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
                    component={TutorialIslandTodayTab}
                />

                <Tab.Screen
                    name={TUTORIAL_TIMELINE_TABS.JOURNEY}
                    listeners={({ navigation, route }) => ({
                        tabPress: (e) => {
                            dispatch(setCurrentTab(TUTORIAL_TIMELINE_TABS.JOURNEY));

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
                    component={TutorialIslandMyJourneyTab}
                />

                <Tab.Screen
                    name={TUTORIAL_TIMELINE_TABS.USER_PROFILE}
                    listeners={({ navigation, route }) => ({
                        tabPress: (e) => {
                            dispatch(setCurrentTab(TUTORIAL_TIMELINE_TABS.USER_PROFILE));

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
                    component={TutorialIslandProfileTab}
                />
            </Tab.Navigator>
        </View>
    );
};
