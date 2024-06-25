import React from 'react';
import { Pressable, View } from 'react-native';
import { TutorialIslandStep } from 'src/model/TutorialIslandModels';
import { GlobalStateCustomHooks } from 'src/redux/user/GlobalStateCustomHooks';
import { TutorialIslandUtil } from 'src/util/TutorialIslandUtil';

interface InnerProps {
    children: React.ReactNode;
    style?: any;
}

const Passthrough = ({ children, style }: InnerProps) => {
    return <View style={style}>{children}</View>;
};

const Blocked = ({ children, style }: InnerProps) => {
    return <View>{children}</View>;
};

interface Props {
    children: React.ReactNode;
    step: TutorialIslandStep;
    style?: any;
}

export const TutorialIsland = ({ children, step, style }: Props) => {
    const tutorialIslandState = GlobalStateCustomHooks.useTutorialIslandState();
    const tutorialIslandIsActive = TutorialIslandUtil.tutorialIsActive(tutorialIslandState);
    const componentIsTargeted = TutorialIslandUtil.tutorialIsTargeted(tutorialIslandState, step);

    if (step) {
        console.log(step, tutorialIslandState.currentStep, componentIsTargeted);
    }

    const disableComponent = tutorialIslandIsActive && !componentIsTargeted;
    return disableComponent ? (
        <Blocked style={style}>{children}</Blocked>
    ) : (
        <Passthrough style={style}>{children}</Passthrough>
    );
};
