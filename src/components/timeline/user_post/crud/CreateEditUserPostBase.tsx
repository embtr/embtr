import * as React from 'react';
import { isIosApp } from 'src/util/DeviceUtil';
import { ScrollView } from 'react-native-gesture-handler';
import { PADDING_LARGE } from 'src/util/constants';
import { Image, UserPost } from 'resources/schema';
import { CreateEditBody } from '../../CreateEditBody';
import { View, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Interactable } from 'resources/types/interactable/Interactable';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';

interface Props {
    userPost: UserPost;
    onSubmit: (userPost: UserPost) => void;
}

export const CreateEditUserPostBase = ({ userPost, onSubmit }: Props) => {
    const navigation = useEmbtrNavigation();

    const onBodySubmit = (body: string, images: Image[]) => {
        const updatedPost = { ...userPost, body, images };
        onSubmit(updatedPost);
    };

    return (
        <Screen>
            <View style={{ flex: 1 }}>
                <Banner
                    name="Share A Story"
                    leftIcon={'arrow-back'}
                    leftOnClick={() => navigation.goBack()}
                />
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={isIosApp() ? 'padding' : 'height'}
                    keyboardVerticalOffset={PADDING_LARGE * 2}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView>
                            <View
                                style={{
                                    flex: 1,
                                    paddingHorizontal: PADDING_LARGE,
                                    paddingBottom: PADDING_LARGE,
                                }}
                            >
                                <CreateEditBody
                                    interactable={Interactable.USER_POST}
                                    images={userPost.images ?? []}
                                    body={userPost.body ?? ''}
                                    onSubmit={onBodySubmit}
                                    minimumTextLength={1}
                                />
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </View>
        </Screen>
    );
};
