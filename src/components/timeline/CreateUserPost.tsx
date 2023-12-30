import * as React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import StoryController from 'src/controller/timeline/story/StoryController';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { CreateEditUserPostBase } from './CreateEditUserPostBase';
import { LoadingOverlay } from 'src/components/common/loading/LoadingOverlay';

export const CreateUserPost = () => {
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();

    const [title, setTitle] = React.useState<string>('');
    const [body, setBody] = React.useState<string>('');
    const [imageUrls, setImageUrls] = React.useState<string[]>([]);
    const [enableSubmit, setEnableSubmit] = React.useState<boolean>();

    const submitStory = async () => {
        if (!title) {
            return;
        }

        if (enableSubmit === false) {
            return;
        }

        setEnableSubmit(false);
        await StoryController.createViaApi(title, body, imageUrls);
        navigation.navigate('Timeline');
    };

    const onImagesUploaded = (uploadedImageUrls: string[]) => {
        let copiedUrls = [...imageUrls];
        copiedUrls = copiedUrls.concat(uploadedImageUrls);
        setImageUrls(copiedUrls);
    };

    const images = imageUrls.map((image) => {
        return {
            url: image,
        };
    });

    const titleHasData = title.length > 0;

    const onDeleteImage = (deletedImageUrl: string) => {
        const updatedImageUrls = imageUrls.filter((imageUrl) => {
            return imageUrl !== deletedImageUrl;
        });
        setImageUrls(updatedImageUrls);
    };

    return (
        <Screen>
            <Banner
                name="Share A Story"
                rightOnClick={submitStory}
                rightText="submit"
                rightColor={titleHasData ? undefined : 'grey'}
                rightEnabled={titleHasData}
                leftText="close"
                leftRoute="BACK"
            />
            <LoadingOverlay />
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
