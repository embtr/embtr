import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Routes, TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { Alert, View } from 'react-native';
import DailyResultController, {
    PlannedDayResultCustomHooks,
} from 'src/controller/timeline/daily_result/DailyResultController';
import { StackNavigationProp } from '@react-navigation/stack';
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
import { PADDING_LARGE } from 'src/util/constants';
import { CommentsScrollView } from 'src/components/common/comments/CommentsScrollView';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { PlannedDayResultInteractableElementCustomHooks } from 'src/components/timeline/interactable/PlannedDayResultInteractableElementCustomHooks';
import { Screen } from 'src/components/common/Screen';
import { PlannedDayResultElement } from './PlannedDayResultElement';
import { TimelineController } from 'src/controller/timeline/TimelineController';
import { useEmbtrRoute } from 'src/hooks/NavigationHooks';

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
    React.useEffect(() => {
        return () => {
            PlannedDayResultInteractableElementCustomHooks.removePlannedDayResultInteractableEventListeners(
                plannedDayResult
            );
        };
    }, []);

    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();
    const closeMenu = useAppSelector(getCloseMenu);

    const interactableData =
        PlannedDayResultInteractableElementCustomHooks.usePlannedDayResultInteractableElement(
            plannedDayResult
        );

    const onEdit = () => {
        if (plannedDayResult.id) {
            navigation.navigate(Routes.EDIT_PLANNED_DAY_RESULT, { id: plannedDayResult.id });
        }
    };

    const onDelete = () => {
        Alert.alert(
            'Delete Daily Result',
            'Are you sure you want to delete this Daily Result? Any future modifications to this day will restore it..',
            [
                {
                    text: 'Cancel',
                    onPress: () => { },
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
                        TimelineController.invalidateCache();
                        if (plannedDayResult.plannedDay?.dayKey) {
                            PlannedDayController.prefetchPlannedDayData(
                                plannedDayResult.plannedDay.dayKey
                            );
                            DailyResultController.invalidateByDayKey(
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
                    name={'Day Results'}
                    leftIcon={'arrow-back'}
                    leftOnClick={() => {
                        navigation.goBack();
                    }}
                    rightIcon={'ellipsis-horizontal'}
                    menuOptions={createEmbtrMenuOptions(menuItems)}
                />
            ) : (
                <Banner name={'Post Details'} leftIcon={'arrow-back'} leftRoute="BACK" />
            )}

            {userIsAuthor && <EmbtrMenuCustom />}

            <ScrollableTextInputBox submitComment={interactableData.onCommentAdded}>
                <View style={{ paddingHorizontal: PADDING_LARGE }}>
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

export const PlannedDayResultDetails = () => {
    const route = useEmbtrRoute(Routes.PLANNED_DAY_RESULT_DETAILS);
    const plannedDayResult = route.params.id
        ? PlannedDayResultCustomHooks.usePlannedDayResult(route.params.id)
        : PlannedDayResultCustomHooks.usePlannedDayResultByDayKey(route.params.dayKey ?? '');

    if (!plannedDayResult.data) {
        return <DailyResultDetailsPlaceholder />;
    }

    return <DailyResultDetailsImplementation plannedDayResult={plannedDayResult.data} />;
};
