import React from 'react';
import { Modal, View, Pressable } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ModalBase } from 'src/components/common/modal/ModalBase';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getShowQuickAddModal, setShowQuickAddModal } from 'src/redux/user/GlobalState';
import * as NavigationBar from 'expo-navigation-bar';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { useNavigation } from '@react-navigation/core';
import { MasterScreens, Routes } from 'src/navigation/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { QuickAddElement } from './QuickAddElement';

interface Props {}

export const QuickAddModal = () => {
    const { colors } = useTheme();

    const showModal = useAppSelector(getShowQuickAddModal);
    const dispatch = useAppDispatch();

    const navigation = useNavigation<StackNavigationProp<MasterScreens>>();

    const dismiss = () => {
        dispatch(setShowQuickAddModal(false));
    };

    React.useEffect(() => {
        if (isAndroidDevice()) {
            NavigationBar.setBackgroundColorAsync(colors.tab_bar_menu);
            NavigationBar.setButtonStyleAsync('light');
        }
    }, [showModal]);

    return (
        <ModalBase visible={showModal}>
            <Modal
                statusBarTranslucent
                animationType="slide"
                style={{ backgroundColor: 'green' }}
                visible={showModal}
                transparent={true}
            >
                <Pressable style={{ flex: 1, backgroundColor: 'transparent' }} onPress={dismiss}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                        }}
                    >
                        {/* bottom row options */}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 0.5 }} />

                            <QuickAddElement
                                imageString="image-outline"
                                text="My Habits"
                                onPress={() => {
                                    navigation.navigate(Routes.MANAGE_HABITS);
                                    dismiss();
                                }}
                            />
                            <View style={{ flex: 1 }} />
                            <QuickAddElement
                                imageString="pencil-outline"
                                text="Add Post"
                                onPress={() => {
                                    navigation.navigate(Routes.CREATE_USER_POST);
                                    dismiss();
                                }}
                            />
                            <View style={{ flex: 1 }} />
                            <QuickAddElement
                                imageString="checkbox-outline"
                                text="Add Habit"
                                onPress={() => {
                                    navigation.navigate(Routes.ADD_HABIT_CATEGORIES);
                                    dismiss();
                                }}
                            />

                            <View style={{ flex: 0.5 }} />
                        </View>

                        <View style={{ height: 15 }} />

                        {/* Close Section */}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }} />
                            <View style={{ top: 10 }}>
                                <QuickAddElement
                                    isClose={true}
                                    imageString="close-outline"
                                    onPress={dismiss}
                                    text=""
                                />
                            </View>
                            <View style={{ flex: 1 }} />
                        </View>

                        <View style={{ height: 15 }} />
                    </View>
                </Pressable>
            </Modal>
        </ModalBase>
    );
};
