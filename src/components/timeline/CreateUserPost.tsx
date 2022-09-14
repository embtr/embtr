import * as React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import StoryController from 'src/controller/timeline/story/StoryController';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { CreateEditUserPostBase } from './CreateEditUserPostBase';

export const CreateUserPost = () => {
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();

    const [title, setTitle] = React.useState<string>('');
    const [body, setBody] = React.useState<string>('');
    const [titleError, setTitleError] = React.useState(false);
    const [storyError, setStoryError] = React.useState(false);

    const submitStory = () => {
        let readyToSubmit = true;

        if (title.length === 0) {
            setTitleError(true);
            readyToSubmit = false;
        }

        if (body.length === 0) {
            setStoryError(true);
            readyToSubmit = false;
        }

        if (readyToSubmit) {
            StoryController.addStory(title, body, () => {
                navigation.navigate('Timeline');
            });
        }
    };

    return (
        <Screen>
            <Banner name="Share A Story" leftIcon={'arrow-back'} leftRoute="BACK" />
            <CreateEditUserPostBase title={title} setTitle={setTitle} body={body} setBody={setBody} onSubmit={submitStory} />
        </Screen>
    );
};
