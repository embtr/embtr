import * as React from 'react';
import { View } from 'react-native';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { TimelineTab } from 'src/components/navigation/TimelineTab';
import { ProfileTab } from 'src/components/navigation/ProfileTab';
import { CommonActions } from '@react-navigation/native';
import { TodayTab } from 'src/components/today/TodayTab';
import { PlanTab } from 'src/components/plan/PlanTab';
import { TabBar } from 'src/components/home/tabmenu/TabBar';

const Tab = createBottomTabNavigator();

export const TABS = {
    USER_PROFILE: "CurrentUserTab",
    TIMELINE: "TimelineTab",
    TODAY: "TodayTab",
    PLAN: "PlanTab"
}

export const Dashboard = () => {
    return (
        <View style={{ flex: 1, overflow: isDesktopBrowser() ? "hidden" : undefined }}>
            <Tab.Navigator
                tabBar={(props: BottomTabBarProps) => <TabBar {...props} />}
                screenOptions={() => ({
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: false,
                    headerShown: false
                })}
            >
                <Tab.Screen
                    name={TABS.TIMELINE}
                    listeners={({ navigation, route }) => ({
                        tabPress: e => {
                            const currentlyInFocus = navigation.isFocused();
                            if (currentlyInFocus && route && route.state && route.state.routes.length >= 1 && route.state.routes[0]['name'] !== "Timeline") {
                                e.preventDefault();
                                navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Timeline' }], }));
                            }
                        },
                    })}
                    component={TimelineTab}
                />

                <Tab.Screen
                    name={TABS.TODAY}
                    listeners={({ navigation, route }) => ({
                        tabPress: e => {
                            const currentlyInFocus = navigation.isFocused();
                            if (currentlyInFocus && route && route.state && route.state.routes.length >= 1 && route.state.routes[0]['name'] !== "Today") {
                                e.preventDefault();
                                navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Today' }], }));
                            }
                        },
                    })}
                    component={TodayTab}
                />

                <Tab.Screen
                    name={TABS.PLAN}
                    listeners={({ navigation, route }) => ({
                        tabPress: e => {
                            const currentlyInFocus = navigation.isFocused();
                            if (currentlyInFocus && route && route.state && route.state.routes.length >= 1 && route.state.routes[0]['name'] !== "PlanMain") {
                                e.preventDefault();
                                navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'PlanMain' }], }));
                            }
                        },
                    })}
                    component={PlanTab}
                />

                <Tab.Screen
                    name={TABS.USER_PROFILE}
                    listeners={({ navigation, route }) => ({
                        tabPress: e => {
                            const currentlyInFocus = navigation.isFocused();
                            if (currentlyInFocus && route && route.state && route.state.routes.length >= 1 && route.state.routes[0]['name'] !== "Profile") {
                                e.preventDefault();
                                navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Profile' }], }));
                            }
                        },
                    })}
                    component={ProfileTab}
                />
            </Tab.Navigator>
        </View>
    );
}