import React from 'react';
import { WidgetBase } from 'src/components/widgets/WidgetBase';
import { View } from 'react-native';
import { Feature } from 'resources/schema';
import { PADDING_LARGE } from 'src/util/constants';
import { FeatureVoteElement } from './FeatureVoteElement';
import { FeatureController, FeatureCustomHooks } from 'src/controller/FeatureController';
import { DetailedFeature } from 'resources/types/dto/Feature';

interface ImplProps {
    detailedFeatures: DetailedFeature[];
    currentVote?: Feature;
}

const FeatureVoteElementsImpl = ({ detailedFeatures, currentVote }: ImplProps) => {
    const onSelected = async (id: number) => {
        await FeatureController.vote(id);
        FeatureController.invalidateVote();
        FeatureController.invalidateDetailedFeatures();
    };

    const elements: JSX.Element[] = [];

    const sortedDetailedFeatures = [...detailedFeatures];
    sortedDetailedFeatures.sort((a, b) => b.votes - a.votes);

    sortedDetailedFeatures.forEach((detailedFeature, index) => {
        elements.push(
            <View style={{ paddingTop: index === 0 ? 0 : PADDING_LARGE }} key={detailedFeature.id}>
                <FeatureVoteElement
                    detailedFeature={detailedFeature}
                    selected={currentVote?.id === detailedFeature.id}
                    onSelected={onSelected}
                />
            </View>
        );
    });

    return <WidgetBase>{elements}</WidgetBase>;
};

export const FeatureVoteElements = () => {
    const detailedFeatures = FeatureCustomHooks.useDetailedFeatures();
    const currentVote = FeatureCustomHooks.useVote();

    if (!detailedFeatures.data) {
        return null;
    }

    return (
        <FeatureVoteElementsImpl
            detailedFeatures={detailedFeatures.data}
            currentVote={currentVote.data}
        />
    );
};
