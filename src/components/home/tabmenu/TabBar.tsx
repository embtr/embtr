import React from "react";
import { View, TouchableOpacity, Dimensions, StyleSheet, } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { TabElement } from "src/components/home/tabmenu/TabElement";
import { useTheme } from "src/components/theme/ThemeProvider";
import Animated from "react-native-reanimated";
import { TABS } from "src/components/home/Dashboard";
import { UserTabElement } from "src/components/home/tabmenu/UserTabElement";

export const TabBar = ({ state, navigation }: BottomTabBarProps) => {
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
            elevation: 10,
            bottom: 0,
        },
        slider: {
            marginTop: 2.5,
            height: 5,
            width: 5,
            top: 0,
            left: 10,
            backgroundColor: colors.tab_selected,
            borderRadius: 50,
        },
    });

    const iconSize = 22.5;
    const totalWidth = Dimensions.get("window").width;
    const tabWidth = totalWidth / state.routes.length;

    const calculateDotLocation = (index: number) => {
        return index * tabWidth + (tabWidth / 2 - 12.5);
    }

    const [translateValue] = React.useState(new Animated.Value(calculateDotLocation(0)));

    let elements: JSX.Element[] = [];
    state.routes.forEach((route, index) => {
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

            const config = {
                damping: 25,
                mass: 1,
                stiffness: 300,
                overshootClamping: false,
                restSpeedThreshold: 0.001,
                restDisplacementThreshold: 0.001,
            }

            Animated.spring(translateValue, {
                toValue: calculateDotLocation(index),
                ...config
            }).start();
        }

        let element: JSX.Element = <View />;
        if (route.name === TABS.TIMELINE) {
            let icon: any = isFocused ? 'ios-home' : 'ios-home-outline';
            element = <TabElement icon={icon} size={iconSize} focused={isFocused} />
        }

        else if (route.name === TABS.TODAY) {
            let icon: any = isFocused ? 'sunny' : 'sunny-outline';
            element = <TabElement icon={icon} size={iconSize} focused={isFocused} />
        }

        else if (route.name === TABS.PLAN) {
            let icon: any = isFocused ? 'calendar' : 'calendar-outline';
            element = <TabElement icon={icon} size={iconSize} focused={isFocused} />
        }

        else if (route.name === TABS.USER_PROFILE) {
            element = <UserTabElement size={iconSize} />
        }

        elements.push(
            <TouchableOpacity
                accessibilityRole="button"
                onPress={onPress}
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
                {elements}
            </View>

            <Animated.View
                style={[
                    style.slider,
                    {
                        transform: [{ translateX: translateValue }]
                    },
                ]}
            />
        </View>
    );
};