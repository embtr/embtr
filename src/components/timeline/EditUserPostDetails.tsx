import * as React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import StoryController from 'src/controller/timeline/story/StoryController';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { CreateEditUserPostBase } from './CreateEditUserPostBase';
import { Image, UserPost } from 'resources/schema';

export const EditUserPostDetails = () => {
    const route = useRoute<RouteProp<TimelineTabScreens, 'EditUserPostDetails'>>();
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();

    const [userPost, setUserPost] = React.useState<UserPost>();

    const [title, setTitle] = React.useState<string>('');
    const [body, setBody] = React.useState<string>('');
    const [images, setImages] = React.useState<Image[]>([]);

    const fetch = async () => {
        const userPost = await StoryController.getViaApi(route.params.id);
        if (!userPost) {
            return;
        }

        setTitle(userPost.title ?? '');
        setBody(userPost.body ?? '');
        setImages(userPost.images ?? []);
        setUserPost(userPost);
    };

    React.useEffect(() => {
        fetch();
    }, []);

    const saveUserPost = async () => {
        if (!userPost) {
            return;
        }

        let clonedUserPost = { ...userPost };
        clonedUserPost.title = title;
        clonedUserPost.body = body;
        clonedUserPost.images = images;

        await StoryController.updateViaApi(clonedUserPost);

        navigation.goBack();
    };

    const onImagesUploaded = (uploadedImageUrls: string[]) => {
        let newImages: Image[] = [];
        uploadedImageUrls.forEach((imageUrl) => {
            newImages.push({ url: imageUrl });
        });

        const updatedImages = images.concat(newImages);
        setImages(updatedImages);
    };

    const onDeleteImage = (deletedImageUrl: string) => {
        const updatedImages = images.map((image) => {
            if (image.url === deletedImageUrl) {
                image.active = false;
            }
            return image;
        });

        setImages(updatedImages);
    };

    return (
        <Screen>
            <Banner name="Edit Post" leftText={'Cancel'} leftRoute="BACK" rightText={'Save'} rightOnClick={saveUserPost} />
            <CreateEditUserPostBase
                title={title}
                setTitle={setTitle}
                body={body}
                setBody={setBody}
                images={images}
                onImagesUploaded={onImagesUploaded}
                onDeleteImage={onDeleteImage}
            />
        </Screen>
    );
};
