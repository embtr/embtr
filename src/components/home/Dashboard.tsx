import * as React from 'react';
import { Text, View, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { TimelineTab } from 'src/components/navigation/TimelineTab';
import { ProfileTab } from 'src/components/navigation/ProfileTab';
import { CommonActions } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { ExploreTab } from 'src/components/navigation/ExploreTab';

const Tab = createBottomTabNavigator();

const TABS = {
    EXPLORE: "ExploreTab",
    USER_PROFILE: "CurrentUserTab",
    TIMELINE: "TimelineTab",
}

export const Dashboard = () => {
    const { colors } = useTheme();

    const userProfileUrl = getAuth().currentUser?.photoURL;

    return (
        <View style={{ flex: 1, backgroundColor: "red", overflow: isDesktopBrowser() ? "hidden" : undefined }}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarStyle: { backgroundColor: colors.background },
                    tabBarIcon: ({ focused, size }) => {
                        if (route.name === TABS.EXPLORE) {
                            let icon: any = focused ? 'compass' : 'compass-outline';
                            let color = focused ? colors.primary_border : colors.text;
                            return (
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Ionicons name={icon} size={size} color={color} />
                                    <Text style={{ color: color }}>explore</Text>
                                </View>
                            )
                        }

                        if (route.name === TABS.TIMELINE) {
                            let icon: any = focused ? 'ios-home' : 'ios-home-outline';
                            let color = focused ? colors.primary_border : colors.text;
                            return (
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Ionicons name={icon} size={size} color={color} />
                                    <Text style={{ color: color }}>timeline</Text>
                                </View>
                            )
                        }

                        if (route.name === TABS.USER_PROFILE) {
                            let textColor = focused ? colors.primary_border : colors.text;
                            let backgroundColor = focused ? colors.primary_border : undefined;
                            return (
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <View style={{ width: size + 2, height: size + 2, borderRadius: 50, backgroundColor: backgroundColor, alignItems: "center", justifyContent: "center" }}>
                                        <Image style={{ width: size, height: size, borderRadius: 50 }} source={{ uri: userProfileUrl! }} />
                                    </View>
                                    <Text style={{ color: textColor }}>you</Text>
                                </View>
                            )
                        }
                    },
                    tabBarShowLabel: false,
                    headerShown: false,
                    tabBarActiveBackgroundColor: colors.background_secondary,
                    tabBarInactiveBackgroundColor: colors.background,
                })}
            >
                <Tab.Screen
                    name={TABS.EXPLORE}
                    listeners={({ navigation, route }) => ({
                        tabPress: e => {
                            const currentlyInFocus = navigation.isFocused();
                            if (currentlyInFocus && route && route.state && route.state.routes.length >= 1 && route.state.routes[0]['name'] !== "Explore") {
                                e.preventDefault();
                                navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Explore' }], }));
                            }
                        },
                    })}
                    component={ExploreTab}
                />

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