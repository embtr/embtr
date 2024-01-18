import { UserPost } from 'resources/schema';
import { UserPostElement } from 'src/components/timeline/UserPostElement';
import { InteractableElementCustomHooks } from 'src/components/timeline/InteractableElementCustomHooks';
import { Pressable } from 'react-native';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';

interface Props {
    userPost: UserPost;
}

export const UserPostTimelineElement = ({ userPost }: Props) => {
    const interactableData =
        InteractableElementCustomHooks.useUserPostInteractableElement(userPost);
    const navigation = useEmbtrNavigation();

    const navigateToPostDetails = () => {
        if (!userPost.id) {
            return;
        }
    };

    return (
        <Pressable>
            <UserPostElement userPost={userPost} interactableData={interactableData} />
        </Pressable>
    );
};
