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
import { ChallengeTab } from 'src/components/challenge/ChallengeTab';
import React from 'react';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { MasterScreens, Routes } from 'src/navigation/RootStackParamList';
import NEW_USER_PROFILE_POPULATION = Routes.NEW_USER_PROFILE_POPULATION;
import { UserCustomHooks } from 'src/controller/user/UserController';

const Tab = createBottomTabNavigator();

export const TABS = {
    USER_PROFILE: 'CurrentUserTab',
    TIMELINE: 'TimelineTab',
    TODAY: 'TodayTab',
    PLAN: 'PlanTab',
    CHALLENGE: 'ChallengeTab',
};

export const Dashboard = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<StackNavigationProp<MasterScreens>>();

    const currentUser = UserCustomHooks.useCurrentUser();

    React.useEffect(() => {
        dispatch(setCurrentTab(TABS.TODAY));
    }, []);

    React.useEffect(() => {
        setTimeout(() => {
            if (currentUser.data && !currentUser.data.accountSetup) {
                navigation.navigate(NEW_USER_PROFILE_POPULATION);
            }
        }, 250);
    }, [currentUser.data]);

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
                    name={'PLACEHOLDER'}
                    listeners={({ navigation, route }) => ({
                        tabPress: (e) => {
                            dispatch(setCurrentTab(TABS.CHALLENGE));

                            const currentlyInFocus = navigation.isFocused();
                            if (
                                currentlyInFocus &&
                                route &&
                                route.state &&
                                route.state.routes.length >= 1 &&
                                route.state.routes[0]['name'] !== 'PlanMain'
                            ) {
                                e.preventDefault();
                                navigation.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{ name: 'PlanMain' }],
                                    })
                                );
                            }
                        },
                    })}
                    component={ChallengeTab}
                />

                <Tab.Screen
                    name={TABS.CHALLENGE}
                    listeners={({ navigation, route }) => ({
                        tabPress: (e) => {
                            dispatch(setCurrentTab(TABS.CHALLENGE));

                            const currentlyInFocus = navigation.isFocused();
                            if (
                                currentlyInFocus &&
                                route &&
                                route.state &&
                                route.state.routes.length >= 1 &&
                                route.state.routes[0]['name'] !== 'PlanMain'
                            ) {
                                e.preventDefault();
                                navigation.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{ name: 'PlanMain' }],
                                    })
                                );
                            }
                        },
                    })}
                    component={ChallengeTab}
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
