import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { TextCard } from 'src/components/common/timeline/TextCard';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { RootStackParamList, TimelineTabScreens } from 'src/navigation/RootStackParamList';

type userProfileScreenProp = StackNavigationProp<RootStackParamList>;

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

    return <TextCard httpImage={userProfileModel.photoUrl!} onTouchImage={toUserProfile} name={userProfileModel.name!} title={title} body={body} />
}