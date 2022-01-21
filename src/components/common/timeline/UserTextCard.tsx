import * as React from 'react';
import { TextCard } from 'src/components/common/timeline/TextCard';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';

interface Props {
    userProfileModel: UserProfileModel,
    title: string,
    body: string,
}

export const UserTextCard = ({ userProfileModel, title, body }: Props) => {
    return <TextCard httpImage={userProfileModel.photoUrl!} name={userProfileModel.name!} title={title} body={body} />
}