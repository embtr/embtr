import * as React from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { Alert, View } from 'react-native';
import DailyResultController, {
    PlannedDayResultCustomHooks,
} from 'src/controller/timeline/daily_result/DailyResultController';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screen } from '../Screen';
import { PlannedDayResult } from 'resources/schema';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';
import PlannedDayController from 'src/controller/planning/PlannedDayController';
import { Banner } from 'src/components/common/Banner';
import {
    createEmbtrMenuOptions,
    EmbtrMenuOption,
} from 'src/components/common/menu/EmbtrMenuOption';
import { EmbtrMenuCustom } from 'src/components/common/menu/EmbtrMenuCustom';
import ScrollableTextInputBox from 'src/components/common/textbox/ScrollableTextInputBox';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { CommentsScrollView } from 'src/components/common/comments/CommentsScrollView';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { PlannedDayResultElement } from 'src/components/timeline/PlannedDayResultElement';
import { PlannedDayResultInteractableElementCustomHooks } from 'src/components/timeline/interactable/PlannedDayResultInteractableElementCustomHooks';

export const DailyResultDetailsPlaceholder = () => {
    return (
        <Screen>
            <View />
        </Screen>
    );
};

export interface DailyResultDetailsProps {
    plannedDayResult: PlannedDayResult;
}

export const DailyResultDetailsImplementation = ({ plannedDayResult }: DailyResultDetailsProps) => {
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();
    const closeMenu = useAppSelector(getCloseMenu);

    const interactableData =
        PlannedDayResultInteractableElementCustomHooks.usePlannedDayResultInteractableElement(
            plannedDayResult
        );

    const onEdit = () => {
        if (plannedDayResult.id) {
            navigation.navigate('EditDailyResultDetails', { id: plannedDayResult.id });
        }
    };

    const onDelete = () => {
        Alert.alert(
            'Delete Daily Result',
            'Are you sure you want to delete this Daily Result? Any future modifications to this day will restore it..',
            [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'I am sure. Delete it.',
                    onPress: async () => {
                        if (!plannedDayResult.id) {
                            return;
                        }

                        const clone: PlannedDayResult = { ...plannedDayResult, active: false };
                        await DailyResultController.updateViaApi(clone);
                        if (plannedDayResult.plannedDay?.dayKey) {
                            PlannedDayController.prefetchPlannedDayData(
                                plannedDayResult.plannedDay.dayKey
                            );
                        }
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    const menuItems: EmbtrMenuOption[] = [
        {
            name: 'Edit',
            onPress: () => {
                onEdit();
                closeMenu();
            },
        },
        {
            name: 'Delete',
            onPress: () => {
                onDelete();
                closeMenu();
            },
            destructive: true,
        },
    ];

    if (!plannedDayResult) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    const userIsAuthor = plannedDayResult.plannedDay?.user?.uid === getCurrentUid();

    return (
        <Screen>
            {userIsAuthor ? (
                <Banner
                    name={'Post Details'}
                    leftIcon={'arrow-back'}
                    leftRoute="BACK"
                    rightIcon={'ellipsis-horizontal'}
                    menuOptions={createEmbtrMenuOptions(menuItems)}
                />
            ) : (
                <Banner name={'Post Details'} leftIcon={'arrow-back'} leftRoute="BACK" />
            )}

            {userIsAuthor && <EmbtrMenuCustom />}

            <ScrollableTextInputBox submitComment={interactableData.onCommentAdded}>
                <View style={{ paddingHorizontal: TIMELINE_CARD_PADDING }}>
                    <PlannedDayResultElement
                        plannedDayResult={plannedDayResult}
                        interactableData={interactableData}
                    />
                </View>
                <CommentsScrollView
                    comments={interactableData.comments}
                    onDeleteComment={interactableData.onCommentDeleted}
                />
            </ScrollableTextInputBox>
        </Screen>
    );
};

export const DailyResultDetails = () => {
    const route = useRoute<RouteProp<TimelineTabScreens, 'DailyResultDetails'>>();
    const plannedDayResult = PlannedDayResultCustomHooks.usePlannedDayResult(route.params.id);

    React.useEffect(() => {
        return () => {
            if (!plannedDayResult.data) {
                return;
            }

            PlannedDayResultInteractableElementCustomHooks.removePlannedDayResultInteractableEventListeners(
                plannedDayResult.data
            );
        };
    }, []);

    if (!plannedDayResult.data) {
        return <DailyResultDetailsPlaceholder />;
    }

    return <DailyResultDetailsImplementation plannedDayResult={plannedDayResult.data} />;
};
