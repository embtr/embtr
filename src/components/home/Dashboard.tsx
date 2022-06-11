import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { TimelineTab } from 'src/components/navigation/TimelineTab';
import { ProfileTab } from 'src/components/navigation/ProfileTab';
import { CommonActions } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { TodayTab } from 'src/components/today/TodayTab';
import { PlanTab } from 'src/components/plan/PlanTab';
import { TabBar } from 'src/components/home/tabmenu/TabBar';

const Tab = createBottomTabNavigator();

const TABS = {
    USER_PROFILE: "CurrentUserTab",
    TIMELINE: "TimelineTab",
    TODAY: "TodayTab",
    PLAN: "PlanTab"
}

const style = StyleSheet.create({
    tabContainer: {
        height: 60,
        shadowOffset: {
            width: 0,
            height: -1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4.0,
        backgroundColor: "white",
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        elevation: 10,
        position: "absolute",
        bottom: 0,
    },
    slider: {
        height: 5,
        position: "absolute",
        top: 0,
        left: 10,
        backgroundColor: "blue",
        borderRadius: 10,
        width: 50
    },
});

export const Dashboard = () => {
    const { colors } = useTheme();

    const userProfileUrl = getAuth().currentUser?.photoURL;

    return (
        <View style={{ flex: 1, overflow: isDesktopBrowser() ? "hidden" : undefined }}>
            <Tab.Navigator
                tabBar={(props: BottomTabBarProps) => <TabBar {...props} />}
                screenOptions={() => ({
                    tabBarStyle: { backgroundColor: colors.tab_bar_menu },
                    tabBarHideOnKeyboard: false,
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