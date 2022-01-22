import * as React from 'react';
import { TextCard } from 'src/components/common/timeline/TextCard';
import { ChallangeModel as ChallengeModel } from 'src/controller/explore/ExploreController';

interface Props {
    challengeModel: ChallengeModel
}

export const EmbtrTextCard = ({ challengeModel }: Props) => {
    return <TextCard staticImage={require('assets/logo.png')} name={"embtr."} title={challengeModel.title} body={challengeModel.synopsis} />
}