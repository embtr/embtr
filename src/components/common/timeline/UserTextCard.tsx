import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TextCard } from 'src/components/common/timeline/TextCard';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';

type userProfileScreenProp = StackNavigationProp<TimelineTabScreens, 'UserProfile'>;

interface Props {
    userProfileModel: UserProfileModel,
    title: string,
    body: string,
}

export const UserTextCard = ({ userProfileModel, title, body }: Props) => {
    const navigation = useNavigation<userProfileScreenProp>();
    const toUserProfile = () => {
        navigation.navigate('UserProfile', { id: userProfileModel.uid! })
    };

    return <TextCard httpImage={userProfileModel.photoUrl!} onTouchImage={toUserProfile} name={userProfileModel.name!} title={title} body={body} likes={0} comments={0} />
}