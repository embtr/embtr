import * as React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { CommentsScrollView } from 'src/components/common/comments/CommentsScrollView';
import { useFocusEffect } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { createEmbtrMenuOptions, EmbtrMenuOption } from '../menu/EmbtrMenuOption';
import { EmbtrMenuCustom } from '../menu/EmbtrMenuCustom';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';
import ScrollableTextInputBox from '../textbox/ScrollableTextInputBox';
import { User as UserModel } from 'resources/schema';
import UserController from 'src/controller/user/UserController';
import { TimelinePostModel } from 'src/model/OldModels';
import { TimelineCard } from 'src/components/timeline/TimelineCard';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { View } from 'react-native';

interface Props {
    timelinePostModel: TimelinePostModel;
    onLike: Function;
    submitComment: Function;
    deleteComment: Function;
    onEdit?: Function;
    onDelete?: Function;
}

export const PostDetails = ({
    timelinePostModel,
    submitComment,
    deleteComment,
    onEdit,
    onDelete,
}: Props) => {
    const closeMenu = useAppSelector(getCloseMenu);
    const [currentUser, setCurrentUser] = React.useState<UserModel | undefined>(undefined);

    useFocusEffect(
        React.useCallback(() => {
            const fetchCurrentUser = async () => {
                const uid = getAuth().currentUser?.uid;
                if (uid) {
                    const currentUserResponse = await UserController.getUserByUidViaApi(uid);
                    if (currentUserResponse.user) {
                        setCurrentUser(currentUserResponse.user);
                    }
                }
            };

            fetchCurrentUser();
        }, [])
    );

    const menuItems: EmbtrMenuOption[] = [
        {
            name: 'Edit',
            onPress: () => {
                if (onEdit) {
                    onEdit();
                    closeMenu();
                }
            },
        },
        {
            name: 'Delete',
            onPress: () => {
                if (onDelete) {
                    onDelete();
                    closeMenu();
                }
            },
            destructive: true,
        },
    ];

    const userIsAuthor = currentUser?.uid === timelinePostModel.user?.uid;
    const comments = timelinePostModel.comments ?? [];

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
                <Banner name={'Popst Details'} leftIcon={'arrow-back'} leftRoute="BACK" />
            )}

            {userIsAuthor && <EmbtrMenuCustom />}

            <ScrollableTextInputBox submitComment={submitComment}>
                <View style={{ paddingHorizontal: TIMELINE_CARD_PADDING }}>
                    <TimelineCard
                        timelinePostModel={timelinePostModel}
                        navigateToDetails={() => {}}
                    />
                </View>
                <CommentsScrollView comments={comments} onDeleteComment={deleteComment} />
            </ScrollableTextInputBox>
        </Screen>
    );
};
