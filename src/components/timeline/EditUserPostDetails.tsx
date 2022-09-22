import * as React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import StoryController, { copyStory, StoryModel } from 'src/controller/timeline/story/StoryController';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { getAuth } from 'firebase/auth';
import { CreateEditUserPostBase } from './CreateEditUserPostBase';

export const EditUserPostDetails = () => {
    const route = useRoute<RouteProp<TimelineTabScreens, 'EditUserPostDetails'>>();
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();

    const [userPost, setUserPost] = React.useState<StoryModel>();

    const [title, setTitle] = React.useState<string>('');
    const [body, setBody] = React.useState<string>('');
    const [imageUrls, setImageUrls] = React.useState<string[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            StoryController.getStory(route.params.id, (foundStory: StoryModel) => {
                if (foundStory.uid === getAuth().currentUser?.uid) {
                    setUserPost(foundStory);
                    setTitle(foundStory.data.title);
                    setBody(foundStory.data.story);
                    setImageUrls(foundStory.data.images);
                }
            });
        }, [])
    );

    const saveUserPost = async () => {
        if (!userPost) {
            return;
        }

        let clonedUserPost = copyStory(userPost);
        clonedUserPost.data.title = title;
        clonedUserPost.data.story = body;
        clonedUserPost.data.images = imageUrls;
        await StoryController.update(clonedUserPost);
        navigation.goBack();
    };

    const onImagesUploaded = (uploadedImageUrls: string[]) => {
        let copiedUrls = [...imageUrls];
        copiedUrls = copiedUrls.concat(uploadedImageUrls);
        setImageUrls(copiedUrls);
    };

    const onDeleteImage = (deletedImageUrl: string) => {
        let updatedImageUrls: string[] = [];
        imageUrls.forEach((imageUrl) => {
            if (imageUrl !== deletedImageUrl) {
                updatedImageUrls.push(imageUrl);
            }
        });
        setImageUrls(updatedImageUrls);
    };

    return (
        <Screen>
            <Banner name="Edit Post" leftIcon={'arrow-back'} leftRoute="BACK" />
            <CreateEditUserPostBase
                title={title}
                setTitle={setTitle}
                body={body}
                setBody={setBody}
                onSubmit={saveUserPost}
                images={imageUrls}
                onImagesUploaded={onImagesUploaded}
                onDeleteImage={onDeleteImage}
            />
        </Screen>
    );
};
