import * as React from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { Alert, View } from 'react-native';
import DailyResultController, {
    PlannedDayResultCustomHooks,
} from 'src/controller/timeline/daily_result/DailyResultController';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screen } from '../Screen';
import { Comment, PlannedDayResult, User } from 'resources/schema';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
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
import { PlannedDayResultTimelineElement } from 'src/components/timeline/PlannedDayResultTimelineElement';

export const DailyResultDetails = () => {
    const route = useRoute<RouteProp<TimelineTabScreens, 'DailyResultDetails'>>();
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();
    const closeMenu = useAppSelector(getCloseMenu);
    const dispatch = useAppDispatch();

    const plannedDayResult = PlannedDayResultCustomHooks.usePlannedDayResult(route.params.id);

    if (!plannedDayResult.data) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    const submitComment = async (text: string, taggedUsers: User[]) => {
        if (plannedDayResult.data?.id) {
            await DailyResultController.addCommentViaApi(plannedDayResult.data.id, text);
            DailyResultController.invalidate(route.params.id);
        }
    };

    const deleteComment = async (comment: Comment) => {
        if (plannedDayResult.data?.id) {
            await DailyResultController.deleteCommentViaApi(comment);
            DailyResultController.invalidate(route.params.id);
        }
    };

    const onEdit = () => {
        if (plannedDayResult.data?.id) {
            navigation.navigate('EditDailyResultDetails', { id: plannedDayResult.data.id });
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
                        if (!plannedDayResult.data?.id) {
                            return;
                        }

                        const clone: PlannedDayResult = { ...plannedDayResult.data, active: false };
                        await DailyResultController.updateViaApi(clone);
                        if (plannedDayResult.data?.plannedDay?.dayKey) {
                            PlannedDayController.prefetchPlannedDayData(
                                plannedDayResult.data.plannedDay.dayKey
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

    const userIsAuthor = plannedDayResult.data?.plannedDay?.user?.uid === getCurrentUid();
    const comments = plannedDayResult.data?.comments ?? [];

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

            <ScrollableTextInputBox submitComment={submitComment}>
                <View style={{ paddingHorizontal: TIMELINE_CARD_PADDING }}>
                    <PlannedDayResultTimelineElement
                        initialPlannedDayResult={plannedDayResult.data}
                    />
                </View>
                <CommentsScrollView comments={comments} onDeleteComment={deleteComment} />
            </ScrollableTextInputBox>
        </Screen>
    );
};
