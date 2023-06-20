import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { WidgetBase } from 'src/components/widgets/WidgetBase';
import { POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { getWindowWidth } from 'src/util/GeneralUtility';
import StoryController from 'src/controller/timeline/story/StoryController';
import { UserPost } from 'resources/schema';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentTab } from 'src/redux/user/GlobalState';
import { getNavigationHook } from 'src/util/navigation/NavigationHookProvider';
import { HorizontalLine } from 'src/components/common/HorizontalLine';

interface Props {
    userId: number;
}

export const UserActivityWidget = ({ userId }: Props) => {
    const { colors } = useTheme();

    const currentTab = useAppSelector(getCurrentTab);
    const navigation = getNavigationHook(currentTab)();

    const diameter = 9;
    const margin = ((getWindowWidth() - 25) / 30 - diameter) / 2;

    const [posts, setPosts] = React.useState<UserPost[]>([]);

    const fetch = async () => {
        const posts = await StoryController.getAllForUser(userId);
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
        const element = (
            <Pressable
                onPress={() => {
                    //@ts-ignore
                    navigation.navigate('UserPostDetails', { id: post.id });
                }}
            >
                <View
                    key={i}
                    style={{
                        padding: 10,
                        paddingTop: 12,
                        flexDirection: 'row',
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <View>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontFamily: POPPINS_SEMI_BOLD,
                                    fontSize: 12,
                                }}
                            >
                                {post.title}
                            </Text>
                        </View>
                        <View>
                            <Text
                                style={{
                                    color: colors.secondary_text,
                                    fontFamily: POPPINS_REGULAR,
                                    fontSize: 12,
                                }}
                            >
                                {(post.body ? post.body.substring(0, 100) : 'view more') + '...'}
                            </Text>
                        </View>
                    </View>

                    <View style={{ justifyContent: 'center', paddingLeft: 10 }}>
                        <View>
                            <Ionicons name={'chevron-forward'} size={14} color={colors.text} />
                        </View>
                    </View>
                </View>
            </Pressable>
        );

        postElements.push(element);
    }

    return (
        <WidgetBase>
            <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>
                User Posts
            </Text>

            <View style={{ width: '100%' }}>
                {postElements.length > 0 && (
                    <View>
                        <View>{postElements}</View>
                        <View style={{ width: '100%', paddingLeft: 10 }}>
                            <Text
                                onPress={() => {
                                    //@ts-ignore
                                    navigation.navigate('UserPosts', { userId: userId });
                                }}
                                style={{ color: colors.secondary_text, fontSize: 12 }}
                            >
                                view all..
                            </Text>
                        </View>
                    </View>
                )}
                {postElements.length === 0 && (
                    <View>
                        {
                            <Text style={{ color: colors.text, paddingLeft: 5 }}>
                                no recent posts...
                            </Text>
                        }
                    </View>
                )}
            </View>
        </WidgetBase>
    );
};
