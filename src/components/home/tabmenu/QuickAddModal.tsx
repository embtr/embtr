import { Modal, View, Text, Pressable } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ModalBase } from 'src/components/common/modal/ModalBase';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import {
    getCurrentTab,
    getShowQuickAddModal,
    setShowQuickAddModal,
} from 'src/redux/user/GlobalState';
import { Ionicons } from '@expo/vector-icons';
import { getNavigationHook } from 'src/util/navigation/NavigationHookProvider';
import React from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { useNavigation } from '@react-navigation/core';
import { RootStackParamList, Routes } from 'src/navigation/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';

interface Props {}

export const QuickAddModal = () => {
    const { colors } = useTheme();

    const showModal = useAppSelector(getShowQuickAddModal);
    const dispatch = useAppDispatch();

    const currentTab = useAppSelector(getCurrentTab);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const onHandleDismiss = () => {
        dispatch(setShowQuickAddModal(false));
    };

    React.useEffect(() => {
        if (isAndroidDevice()) {
            NavigationBar.setBackgroundColorAsync(colors.tab_bar_menu);
            NavigationBar.setButtonStyleAsync('light');
        }
    }, [showModal]);

    const backgroundColor = 'white';
    const coreHeight = 200;
    const circleSize = 70;
    const imageSize = 27.5;

    return (
        <ModalBase visible={showModal}>
            <Modal
                statusBarTranslucent
                animationType="slide"
                style={{ backgroundColor: 'green' }}
                visible={showModal}
                transparent={true}
            >
                <Pressable
                    style={{ flex: 1, backgroundColor: 'transparent' }}
                    onPress={() => {
                        onHandleDismiss();
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                        }}
                    >
                        <View style={{ flex: 1, height: coreHeight, alignItems: 'center' }}>
                            <Pressable
                                onPress={() => {
                                    navigation.navigate('CreateUserPost');
                                    onHandleDismiss();
                                }}
                                style={{
                                    backgroundColor: backgroundColor,
                                    height: circleSize,
                                    width: circleSize,
                                    borderRadius: 50,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Ionicons
                                    name="image-outline"
                                    size={imageSize}
                                    color={colors.accent_color}
                                />
                            </Pressable>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                height: coreHeight,
                            }}
                        >
                            <Pressable
                                onPress={() => {
                                    navigation.navigate('CreateUserPost');
                                    onHandleDismiss();
                                }}
                                style={{
                                    backgroundColor: backgroundColor,
                                    height: circleSize,
                                    width: circleSize,
                                    borderRadius: 50,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Ionicons
                                    name="pencil-outline"
                                    size={imageSize}
                                    color={colors.accent_color}
                                />
                            </Pressable>

                            <View style={{ flex: 1 }} />

                            <Pressable
                                onPress={() => {
                                    onHandleDismiss();
                                }}
                                style={{
                                    backgroundColor: colors.tab_selected,
                                    height: circleSize,
                                    width: circleSize,
                                    borderRadius: 50,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bottom: isAndroidDevice() ? 5 : 20,
                                }}
                            >
                                <Ionicons
                                    name="close-outline"
                                    size={imageSize}
                                    color={backgroundColor}
                                />
                            </Pressable>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', height: coreHeight }}>
                            <Pressable
                                onPress={() => {
                                    navigation.navigate(Routes.ADD_HABIT_CATEGORIES);
                                    onHandleDismiss();
                                }}
                                style={{
                                    backgroundColor: backgroundColor,
                                    height: circleSize,
                                    width: circleSize,
                                    borderRadius: 50,
                                    left: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Ionicons
                                    name="checkbox-outline"
                                    size={imageSize}
                                    color={colors.accent_color}
                                />
                            </Pressable>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </ModalBase>
    );
};
