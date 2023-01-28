import * as React from 'react';
import { Text, View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CommentsScrollView } from 'src/components/common/comments/CommentsScrollView';
import { Comment, Like } from 'src/controller/timeline/TimelineController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { useFocusEffect } from '@react-navigation/native';
import ProfileController from 'src/controller/profile/ProfileController';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { getAuth } from 'firebase/auth';
import { formatDistance } from 'date-fns';
import { HorizontalLine } from '../HorizontalLine';
import { createEmbtrMenuOptions, EmbtrMenuOption } from '../menu/EmbtrMenuOption';
import { EmbtrMenuCustom } from '../menu/EmbtrMenuCustom';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';
import PostDetailsActionBar from './PostDetailsActionBar';
import ScrollableTextInputBox from '../textbox/ScrollableTextInputBox';

interface Props {
    type: string;
    authorUid: string;
    children: any;
    added: Date;
    likes: Like[];
    comments: Comment[];
    onLike: Function;
    submitComment: Function;
    deleteComment: Function;
    onEdit?: Function;
    onDelete?: Function;
}

export const PostDetails = ({ type, authorUid, children, added, likes, comments, onLike, submitComment, deleteComment, onEdit, onDelete }: Props) => {
    const { colors } = useTheme();

    const closeMenu = useAppSelector(getCloseMenu);

    const [author, setAuthor] = React.useState<UserProfileModel>();
    const [currentUserProfile, setCurrentUserProfile] = React.useState<UserProfileModel>();

    useFocusEffect(
        React.useCallback(() => {
            ProfileController.getProfile(authorUid, setAuthor);
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            const uid = getAuth().currentUser?.uid;

            if (uid) {
                ProfileController.getProfile(uid, setCurrentUserProfile);
            }
        }, [])
    );

    const daysRemaining = formatDistance(added, new Date(), { addSuffix: true });

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

    const userIsAuthor = currentUserProfile?.uid === author?.uid;

    return (
        <Screen>
            {userIsAuthor ? (
                <Banner
                    name={type}
                    leftIcon={'arrow-back'}
                    leftRoute="BACK"
                    rightIcon={'ellipsis-horizontal'}
                    menuOptions={createEmbtrMenuOptions(menuItems)}
                />
            ) : (
                <Banner name={type} leftIcon={'arrow-back'} leftRoute="BACK" />
            )}
            {userIsAuthor && <EmbtrMenuCustom />}
            <HorizontalLine />

            {currentUserProfile && author && (
                <ScrollableTextInputBox currentUser={currentUserProfile} postOwner={author} submitComment={submitComment}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, flexDirection: 'row', paddingTop: TIMELINE_CARD_PADDING, paddingLeft: TIMELINE_CARD_PADDING }}>
                            <View>{author && <NavigatableUserImage userProfileModel={author} size={45} />}</View>

                            <View style={{ paddingLeft: 10, flex: 1, alignSelf: 'stretch' }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                        <Text style={{ fontFamily: 'Poppins_600SemiBold', color: colors.timeline_card_header }}>{author?.name}</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: TIMELINE_CARD_PADDING }}>
                                        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, opacity: 0.75, color: colors.timeline_card_header }}>
                                            {daysRemaining}
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 10, color: colors.timeline_card_header }}>
                                        {author?.location}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/*this is the body of the post*/}
                    {children}

                    <View style={{ paddingLeft: TIMELINE_CARD_PADDING, paddingTop: 10, paddingBottom: TIMELINE_CARD_PADDING }}>
                        <PostDetailsActionBar likes={likes} comments={comments} onLike={onLike} />
                    </View>

                    <View style={{ width: '100%', paddingLeft: '3.5%', paddingRight: '3.5%' }}>
                        <View style={{ height: 1, width: '100%', backgroundColor: colors.today_calendar_line, opacity: 0.25 }} />
                    </View>

                    <CommentsScrollView comments={comments} onDeleteComment={deleteComment} />
                </ScrollableTextInputBox>
            )}
        </Screen>
    );
};
