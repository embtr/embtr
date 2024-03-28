import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { WidgetBase } from 'src/components/widgets/WidgetBase';
import {
    POPPINS_SEMI_BOLD,
    PADDING_SMALL,
    PADDING_LARGE,
    POPPINS_REGULAR,
} from 'src/util/constants';
import { NewUserChecklistWidgetElement } from './NewUserChecklistWidgetElement';
import { NewUserChecklistElement } from 'resources/types/dto/NewUserChecklist';
import { EmbtrMenuOption } from 'src/components/common/menu/EmbtrMenuOption';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu, getCurrentUser, getFireConfetti } from 'src/redux/user/GlobalState';
import { EmbtrMenuCustom } from 'src/components/common/menu/EmbtrMenuCustom';
import { NewUserController, NewUserCustomHooks } from 'src/controller/new_user/NewUserController';
import {
    UserPropertyController,
    UserPropertyCustomHooks,
} from 'src/controller/user/UserPropertyController';
import { Constants } from 'resources/types/constants/constants';

const keyExtractor = (item: NewUserChecklistElement) => item.title;

const renderElement = (element: NewUserChecklistElement) => {
    return <NewUserChecklistWidgetElement element={element} />;
};

const dismissChecklist = async (userId: number) => {
    await NewUserController.dismissNewUserChecklist();
    UserPropertyController.invalidate(
        userId,
        Constants.UserPropertyKey.NEW_USER_CHECKLIST_DISMISSED
    );
};

const completeChecklist = async (userId: number) => {
    await NewUserController.completeNewUserChecklist();
    UserPropertyController.invalidate(
        userId,
        Constants.UserPropertyKey.NEW_USER_CHECKLIST_COMPLETED
    );
};

const NewUserChecklistWidgetImpl = () => {
    const { colors } = useTheme();

    const fireConfetti = useAppSelector(getFireConfetti);
    const currentUser = useAppSelector(getCurrentUser);
    const closeMenu = useAppSelector(getCloseMenu);

    const menuOptions: EmbtrMenuOption[] = [
        {
            name: 'Dismiss Checklist',
            destructive: true,
            onPress: () => {
                dismissChecklist(currentUser.id ?? 0);
                closeMenu();
            },
        },
    ];

    const checklist = NewUserCustomHooks.useNewUserChecklist();

    const data: NewUserChecklistElement[] = [
        ...(checklist.data?.incomplete ?? []),
        ...(checklist.data?.complete ?? []),
    ];
    const canDismiss = !checklist.isLoading && checklist.data?.incomplete.length === 0;

    return (
        <WidgetBase menuOptions={menuOptions} symbol="ellipsis-horizontal">
            <View style={{ flexDirection: 'row' }}>
                <Text
                    style={{
                        color: colors.text,
                        fontFamily: POPPINS_SEMI_BOLD,
                        fontSize: 15,
                        lineHeight: 17,
                        bottom: 2,
                    }}
                >
                    New User Checklist
                </Text>
            </View>

            <View style={{ height: PADDING_SMALL }} />
            <EmbtrMenuCustom />

            <FlatList
                contentContainerStyle={{ gap: PADDING_SMALL }}
                data={data}
                keyExtractor={keyExtractor}
                renderItem={({ item }) => renderElement(item)}
            />

            {canDismiss && (
                <TouchableOpacity
                    onPress={() => {
                        completeChecklist(currentUser.id ?? 0);
                        fireConfetti();
                    }}
                >
                    <View
                        style={{
                            height: 50 - PADDING_LARGE,
                            marginTop: PADDING_LARGE,
                            backgroundColor: colors.accent_color,
                            justifyContent: 'center',
                            borderRadius: 3,
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                color: colors.text,
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 16,
                            }}
                        >
                            Complete Checklist
                        </Text>
                    </View>
                </TouchableOpacity>
            )}
        </WidgetBase>
    );
};

export const NewUserChecklistWidget = () => {
    const checklistFinished = NewUserCustomHooks.useUserHasFinishedNewUserChecklist();
    if (checklistFinished) {
        return <View />;
    }

    return <NewUserChecklistWidgetImpl />;
};
