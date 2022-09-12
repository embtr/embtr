import * as React from 'react';
import { View } from 'react-native';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import TimelineController, { TimelinePostModel } from 'src/controller/timeline/TimelineController';
import { UserTextCard } from 'src/components/common/timeline/UserTextCard';
import { CARD_SHADOW } from 'src/util/constants';
import { StoryModel } from 'src/controller/timeline/story/StoryController';
import { DailyResultCard } from 'src/components/common/timeline/DailyResultCard';
import { DailyResultModel } from 'src/controller/timeline/daily_result/DailyResultController';

interface Props {
    userProfileModel: UserProfileModel;
}

const card = {
    width: '100%',
    paddingTop: 10,
    paddingLeft: 5,
    paddingRight: 5,
};

export const ActivityTabRoute = ({ userProfileModel }: Props) => {
    const [posts, setPosts] = React.useState<TimelinePostModel[]>([]);
    const [activityViews, setActivityViews] = React.useState<JSX.Element[]>([]);

    React.useEffect(() => {
        TimelineController.getTimelinePostsForUser(userProfileModel.uid!, setPosts);
    }, []);

    React.useEffect(() => {
        let views: JSX.Element[] = [];
        posts.forEach((timelineEntry) => {
            let view: JSX.Element = <View></View>;
            switch (timelineEntry.type) {
                case 'STORY':
                    view = createStoryView(timelineEntry);
                    break;
                case 'DAILY_RESULT':
                    view = createDailyResultView(timelineEntry);
                    break;
            }
            views.push(view);
        });

        setActivityViews(views);
    }, [posts]);

    const createStoryView = (timelineEntry: TimelinePostModel) => {
        return (
            <View key={timelineEntry.id} style={[card, CARD_SHADOW]}>
                <UserTextCard userProfileModel={userProfileModel} story={timelineEntry as StoryModel} />
            </View>
        );
    };

    const createDailyResultView = (timelineEntry: TimelinePostModel) => {
        return (
            <View key={timelineEntry.id} style={[card, CARD_SHADOW]}>
                <DailyResultCard dailyResult={timelineEntry as DailyResultModel} userProfileModel={userProfileModel} />
            </View>
        );
    };

    return <View>{activityViews.length > 0 && activityViews}</View>;
};
