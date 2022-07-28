import * as React from 'react';
import { View, Text } from 'react-native';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { useTheme } from 'src/components/theme/ThemeProvider';
import TimelineController, { TimelinePostModel } from 'src/controller/timeline/TimelineController';
import { UserTextCard } from 'src/components/common/timeline/UserTextCard';
import { CARD_SHADOW } from 'src/util/constants';
import { useFocusEffect } from '@react-navigation/native';

interface Props {
    userProfileModel: UserProfileModel
}

const card = {
    width: '100%',
    paddingTop: 10,
    paddingLeft: 5,
    paddingRight: 5
}

export const ActivityTabRoute = ({ userProfileModel }: Props) => {
    const { colors } = useTheme();

    const [posts, setPosts] = React.useState<TimelinePostModel[]>([]);
    const [activityViews, setActivityViews] = React.useState<JSX.Element[]>([]);

        React.useEffect(() => {
            TimelineController.getTimelinePostsForUser(userProfileModel.uid!, setPosts);
        }, []);

    React.useEffect(() => {
        let views: JSX.Element[] = [];
        posts.forEach(timelineEntry => {
            const view: JSX.Element = createStoryView(timelineEntry);
            views.push(view);
        });

        setActivityViews(views);
    }, [posts]);

    const createStoryView = (timelineEntry: TimelinePostModel) => {
        return <View key={timelineEntry.id} style={[card, CARD_SHADOW]}>
            <UserTextCard userProfileModel={userProfileModel} story={timelineEntry} />
        </View>;
    };

    return (
        <View>
            {activityViews.length > 0 && activityViews}
        </View>
    )
};