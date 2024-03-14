import React from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { TabElement } from 'src/components/home/tabmenu/TabElement';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Image } from 'expo-image';
import { TABS } from 'src/components/home/Dashboard';
import { UserTabElement } from 'src/components/home/tabmenu/UserTabElement';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { useAppDispatch } from 'src/redux/Hooks';
import { ShadowUtility } from 'src/util/ui/shadow/ShadowUtility';

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
    const config = {
        damping: 25,
        mass: 1,
        stiffness: 300,
        overshootClamping: false,
        restSpeedThreshold: 0.001,
        restDisplacementThreshold: 0.001,
        useNativeDriver: true,
    };

    React.useEffect(() => {
        Animated.spring(translateValue, {
            toValue: calculateDotLocation(state.index),
            ...config,
        }).start();
    }, [state.index]);

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
            let icon: any = isFocused ? 'home' : 'home-outline';
            element = <TabElement icon={icon} size={iconSize} focused={isFocused} />;
        } else if (route.name === TABS.TODAY) {
            element = (
                <View
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
                            {
                                backgroundColor: '#404040',
                                borderRadius: 50,
                                height: 60 * 0.9,
                                width: 60 * 0.9,
                                bottom: 25,
                                justifyContent: 'center',
                                alignItems: 'center',
                                ...ShadowUtility.getShadow(65),
                            },
                        ]}
                    >
                        <Image
                            source={require('assets/logo.png')}
                            style={{
                                top: 2,
                                width: 40 * 0.9,
                                height: 40 * 0.9,
                            }}
                        />
                    </View>
                </View>
            );
        } else if (route.name === TABS.JOURNEY) {
            let icon: any = 'trail-sign-outline';
            element = <TabElement icon={icon} size={iconSize} focused={isFocused} />;
        } else if (route.name === TABS.USER_PROFILE) {
            element = <UserTabElement size={iconSize} />;
        } else {
            let icon: any = isFocused ? 'list-circle' : 'list-circle-outline';
            element = <TabElement icon={icon} size={iconSize} focused={isFocused} />;
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
