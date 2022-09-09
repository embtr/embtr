import * as React from 'react';
import { KeyboardAvoidingView, Text, View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { isIosApp } from 'src/util/DeviceUtil';
import { CommentsScrollView } from 'src/components/common/comments/CommentsScrollView';
import { CommentsTextInput } from 'src/components/common/comments/CommentsTextInput';
import { Comment } from 'src/controller/timeline/TimelineController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { useFocusEffect } from '@react-navigation/native';
import ProfileController from 'src/controller/profile/ProfileController';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { ScrollView } from 'react-native-gesture-handler';
import { getAuth } from 'firebase/auth';
import { formatDistance } from 'date-fns';
import { HorizontalLine } from '../HorizontalLine';

interface Props {
    type: string;
    authorUid: string;
    children: any;
    added: Date;
    comments: Comment[];
    submitComment: Function;
}

export const Comments = ({ type, authorUid, children, added, comments, submitComment }: Props) => {
    const { colors } = useTheme();

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

    const scrollRef = React.useRef<ScrollView>(null);

    const onCommentCountChanged = () => {
        scrollRef.current?.scrollTo(0, 0, false);
    };

    const daysRemaining = formatDistance(added, new Date(), { addSuffix: true });

    return (
        <Screen>
            <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={isIosApp() ? 40 : 111} behavior={isIosApp() ? 'padding' : 'height'}>
                <Banner name={type} leftIcon={'arrow-back'} leftRoute="BACK" />

        <HorizontalLine />
                <ScrollView onContentSizeChange={onCommentCountChanged} ref={scrollRef} style={{ flex: 1 }}>
                    <View style={{ width: '100%', flexDirection: 'row' }}>
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

                    <View style={{ width: '100%', paddingLeft: '3.5%', paddingRight: '3.5%', paddingTop: 10, paddingBottom: 10 }}>
                        <View style={{ height: 1, width: '100%', backgroundColor: colors.today_calendar_line, opacity: 0.25 }} />
                    </View>

                    <CommentsScrollView comments={comments} />
                </ScrollView>

                {currentUserProfile && author && (
                    <CommentsTextInput currentUserProfile={currentUserProfile} authorUserProfile={author} submitComment={submitComment} />
                )}
            </KeyboardAvoidingView>
        </Screen>
    );
};
