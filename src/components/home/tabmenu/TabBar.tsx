import React, { useState } from "react";
import { View, TouchableOpacity, Dimensions, StyleSheet, } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { TabElement } from "src/components/home/tabmenu/TabElement";
import { useTheme } from "src/components/theme/ThemeProvider";

const TABS = {
    USER_PROFILE: "CurrentUserTab",
    TIMELINE: "TimelineTab",
    TODAY: "TodayTab",
    PLAN: "PlanTab"
}

export const TabBar = ({ state, descriptors, navigation, }: BottomTabBarProps) => {
    const totalWidth = Dimensions.get("window").width;
    const tabWidth = totalWidth / state.routes.length;

    const { colors } = useTheme();

    const style = StyleSheet.create({
        tabContainer: {
            height: 60,
            shadowOffset: {
                width: 0,
                height: -1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4.0,
            backgroundColor: colors.tab_bar_menu,
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

    let elements: JSX.Element[] = [];
    state.routes.forEach((route, index) => {
        const { options } = descriptors[route.key];
        const label =
            options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                    ? options.title
                    : route.name;
        const isFocused = state.index === index;
        const onPress = () => {
            const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
            }
        }
        const onLongPress = () => {
            navigation.emit({
                type: "tabLongPress",
                target: route.key,
            });
        };

        let element: JSX.Element = <View />;
        if (route.name === TABS.TIMELINE) {
            let icon: any = isFocused ? 'ios-home' : 'ios-home-outline';
            element = <TabElement icon={icon} size={20} focused={isFocused} />
        }

        else if (route.name === TABS.TODAY) {
            let icon: any = isFocused ? 'sunny' : 'sunny-outline';
            element = <TabElement icon={icon} size={20} focused={isFocused} />
        }

        else if (route.name === TABS.PLAN) {
            let icon: any = isFocused ? 'calendar' : 'calendar-outline';
            element = <TabElement icon={icon} size={20} focused={isFocused} />
        }

        else if (route.name === TABS.USER_PROFILE) {
            let icon: any = isFocused ? 'calendar' : 'calendar-outline';
            element = <TabElement icon={icon} size={20} focused={isFocused} />
        }

        elements.push(
            <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{ flex: 1 }}
                key={index}
            >
                {element}
            </TouchableOpacity>
        );
    });

    return (
        <View style={[style.tabContainer, { width: totalWidth }]}>
            <View style={{ flexDirection: "row" }}>
                <View style={style.slider} />
                {elements}
            </View>
        </View>
    );
};