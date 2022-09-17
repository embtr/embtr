import EventDao from 'src/firebase/firestore/event/EventDao';
import StoryController, { StoryModel } from '../timeline/story/StoryController';
import TimelineController from '../timeline/TimelineController';

class SystemController {
    public static addActiveToAllTimelineItems() {
        StoryController.getStories((stories: StoryModel[]) => {
           stories.forEach(story => {
                if (story.active === undefined) {
                    story.active = true;
                    StoryController.update(story);
                }
           }); 
        });

    }

}

export default SystemController;
