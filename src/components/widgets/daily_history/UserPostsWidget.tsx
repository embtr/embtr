import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { WidgetBase } from 'src/components/widgets/WidgetBase';
import { POPPINS_SEMI_BOLD, PADDING_LARGE } from 'src/util/constants';
import StoryController from 'src/controller/timeline/story/StoryController';
import { UserPost } from 'resources/schema';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentTab } from 'src/redux/user/GlobalState';
import { getNavigationHook } from 'src/util/navigation/NavigationHookProvider';
import { OptimalImageData } from 'src/components/common/images/OptimalImage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PostWidgetElement } from 'src/components/widgets/post_widget_commons/PostWidgetElement';

interface Props {
    userId: number;
}

export const UserPostsWidget = ({ userId }: Props) => {
    const { colors } = useTheme();

    const currentTab = useAppSelector(getCurrentTab);
    const navigation = getNavigationHook(currentTab)();

    const [posts, setPosts] = React.useState<UserPost[]>([]);

    const fetch = async () => {
        const posts = await StoryController.getPosts(userId);
        if (posts) {
            setPosts(posts);
        }
    };

    React.useEffect(() => {
        fetch();
    }, []);

    const postElements: JSX.Element[] = [];
    for (let i = 0; i < (posts.length < 3 ? posts.length : 3); i++) {
        const post = posts[i];

        const imageData: OptimalImageData[] = [];
        post.images?.forEach((image) => {
            imageData.push({
                remoteImageUrl: image.url,
            });
        });
        if (imageData.length === 0) {
            imageData.push({
                remoteImageUrl:
                    'https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/common%2Fpost_placeholder.svg?alt=media',
            });
        }

        const element = (
            <TouchableOpacity
                key={i}
                onPress={() => {
                    //@ts-ignore
                    navigation.navigate('UserPostDetails', { id: post.id });
                }}
            >
                <PostWidgetElement
                    title={post.title ?? ''}
                    body={post.body ?? ''}
                    commentCount={post.comments?.length ?? 0}
                    likeCount={post.likes?.length ?? 0}
                    date={post.createdAt ?? new Date()}
                    imageData={imageData}
                />
            </TouchableOpacity>
        );

        postElements.push(<View style={{ height: PADDING_LARGE / 2 }} />);
        postElements.push(element);
    }

    return (
        <WidgetBase>
            <Text
                style={{
                    color: colors.text,
                    fontFamily: POPPINS_SEMI_BOLD,
                    fontSize: 15,
                    lineHeight: 17,
                }}
            >
                User Posts
            </Text>

            <View style={{ width: '100%' }}>
                {postElements.length > 0 && (
                    <View>
                        <View>{postElements}</View>
                        <View style={{ width: '100%', paddingTop: PADDING_LARGE }}>
                            <Text
                                onPress={() => {
                                    //@ts-ignore
                                    navigation.navigate('UserPosts', { userId: userId });
                                }}
                                style={{ color: colors.link, fontSize: 12 }}
                            >
                                view all..
                            </Text>
                        </View>
                    </View>
                )}

                {postElements.length === 0 && (
                    <Text style={{ color: colors.secondary_text }}>no recent posts...</Text>
                )}
            </View>
        </WidgetBase>
    );
};
