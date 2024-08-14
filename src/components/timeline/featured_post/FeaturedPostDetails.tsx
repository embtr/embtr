import { Routes } from 'src/navigation/RootStackParamList';
import { View } from 'react-native';
import { FeaturedPost } from 'resources/schema';
import { Banner } from 'src/components/common/Banner';
import ScrollableTextInputBox from 'src/components/common/textbox/ScrollableTextInputBox';
import { PADDING_LARGE } from 'src/util/constants';
import * as React from 'react';
import { CommentsScrollView } from 'src/components/common/comments/CommentsScrollView';
import { FeaturedPostInteractableElementCustomHooks } from 'src/components/timeline/interactable/FeaturedPostInteractableElementCustomHooks';
import { Screen } from 'src/components/common/Screen';
import { FeaturedPostElement } from './FeaturedPostElement';
import { useEmbtrRoute } from 'src/hooks/NavigationHooks';
import { FeaturedPostCustomHooks } from 'src/controller/FeaturedPostController';

const FeaturedPostDetailsPlaceholder = () => {
    return (
        <Screen>
            <Banner name={'Featured Post'} leftIcon={'arrow-back'} leftRoute="BACK" />
        </Screen>
    );
};

interface ImplementationProps {
    featuredPost: FeaturedPost;
}

const FeaturedPostDetailsImplementation = ({ featuredPost }: ImplementationProps) => {
    const interactableData =
        FeaturedPostInteractableElementCustomHooks.useFeaturedPostInteractableElement(featuredPost);
    return (
        <Screen>
            <Banner name={'Featured Post'} leftIcon={'arrow-back'} leftRoute="BACK" />

            <ScrollableTextInputBox submitComment={interactableData.onCommentAdded}>
                <View style={{ paddingHorizontal: PADDING_LARGE }}>
                    <FeaturedPostElement
                        featuredPost={featuredPost}
                        interactableData={interactableData}
                    />
                </View>

                <CommentsScrollView
                    comments={interactableData.comments}
                    onDeleteComment={interactableData.onCommentDeleted}
                />
            </ScrollableTextInputBox>
        </Screen>
    );
};

export const FeaturedPostDetails = () => {
    const route = useEmbtrRoute(Routes.FEATURED_POST_DETAILS);
    const featuredPost = FeaturedPostCustomHooks.useFeaturedPost(route.params.id);

    if (!featuredPost.data) {
        return <FeaturedPostDetailsPlaceholder />;
    }

    return <FeaturedPostDetailsImplementation featuredPost={featuredPost.data} />;
};
