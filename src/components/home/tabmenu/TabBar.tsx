import React from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet, Pressable } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { TabElement } from 'src/components/home/tabmenu/TabElement';
import { useTheme } from 'src/components/theme/ThemeProvider';
import Animated from 'react-native-reanimated';
import { TABS } from 'src/components/home/Dashboard';
import { UserTabElement } from 'src/components/home/tabmenu/UserTabElement';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { Ionicons } from '@expo/vector-icons';
import { CARD_SHADOW } from 'src/util/constants';
import { useAppDispatch } from 'src/redux/Hooks';
import { setShowQuickAddModal } from 'src/redux/user/GlobalState';

export const TabBar = ({ state, navigation }: BottomTabBarProps) => {
    const { colors } = useTheme();

    const style = StyleSheet.create({
        tabContainer: {
            paddingBottom: isAndroidDevice() ? 2.5 : 25,
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
            marginTop: 4,
            height: 5,
            width: 5,
            top: 0,
            left: 10,
            backgroundColor: colors.accent_color,
            borderRadius: 50,
        },
    });

    const iconSize = 25;
    const totalWidth = Dimensions.get('window').width;
    const tabWidth = totalWidth / state.routes.length;

    const calculateDotLocation = (index: number) => {
        return index * tabWidth + (tabWidth / 2 - 12.5);
    };

    const dispatch = useAppDispatch();

    const [translateValue] = React.useState(new Animated.Value(calculateDotLocation(1)));

    let elements: JSX.Element[] = [];
    state.routes.forEach((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
            const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
            }
        };

        let element: JSX.Element = <View />;
        if (route.name === TABS.TIMELINE) {
            let icon: any = isFocused ? 'ios-home' : 'ios-home-outline';
            element = <TabElement icon={icon} size={iconSize} focused={isFocused} />;
        } else if (route.name === TABS.TODAY) {
            let icon: any = isFocused ? 'sunny' : 'sunny-outline';
            element = <TabElement icon={icon} size={iconSize} focused={isFocused} />;
        } else if (route.name === TABS.CHALLENGE) {
            let icon: any = isFocused ? 'list-circle' : 'list-circle-outline';
            element = <TabElement icon={icon} size={iconSize} focused={isFocused} />;
        } else if (route.name === TABS.USER_PROFILE) {
            element = <UserTabElement size={iconSize} />;
        } else {
            element = (
                <Pressable
                    onPress={() => {
                        dispatch(setShowQuickAddModal(true));
                    }}
                    style={[
                        {
                            padding: 10,
                            borderRadius: 50,
                            position: 'absolute',
                            zIndex: 2,
                            alignSelf: 'center',
                        },
                    ]}
                >
                    <View
                        style={[
                            CARD_SHADOW,
                            {
                                backgroundColor: colors.accent_color,
                                borderRadius: 50,
                                height: 60,
                                width: 60,

                                bottom: 25,
                                justifyContent: 'center',
                                alignItems: 'center',
                            },
                        ]}
                    >
                        <Ionicons name="add" size={40} color={colors.text} style={{ left: 1.5 }} />
                    </View>
                </Pressable>
            );
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

    /*
     * note! this is experimental (oct 14 2022) - if weird things happen move this logic back to onPress() above
     */
    const config = {
        damping: 25,
        mass: 1,
        stiffness: 300,
        overshootClamping: false,
        restSpeedThreshold: 0.001,
        restDisplacementThreshold: 0.001,
    };

    Animated.spring(translateValue, {
        toValue: calculateDotLocation(state.index),
        ...config,
    }).start();

    /*
     * END EXPERIMENT
     */

    return (
        <View style={[style.tabContainer, { width: totalWidth }]}>
            <View style={{ flexDirection: 'row' }}>{elements}</View>

            <Animated.View
                style={[
                    style.slider,
                    {
                        transform: [{ translateX: translateValue }],
                    },
                ]}
            />
        </View>
    );
};
