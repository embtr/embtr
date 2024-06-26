import React from 'react';
import { View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { TutorialIslandOption } from 'src/model/TutorialIslandModels';
import { GlobalStateCustomHooks } from 'src/redux/user/GlobalStateCustomHooks';
import { TutorialIslandService } from 'src/service/TutorialIslandService';

interface InnerProps {
    children: React.ReactNode;
    option: TutorialIslandOption;
    style?: any;
}

const Targeted = ({ children, option, style }: InnerProps) => {
    const reportOptionPressed = GlobalStateCustomHooks.useReportOptionPressed();

    return (
        <View style={style}>
            <TouchableWithoutFeedback
                onPress={() => {
                    reportOptionPressed(option);
                }}
            >
                {children}
            </TouchableWithoutFeedback>
        </View>
    );
};

const Passthrough = ({ children, option, style }: InnerProps) => {
    return <View style={style}>{children}</View>;
};

const Blocked = ({ children, style }: InnerProps) => {
    return (
        <View style={[style, { pointerEvents: 'none' }]}>
            <View
                style={{
                    opacity: 0.15,
                }}
            >
                {children}
            </View>
        </View>
    );
};

interface Props {
    children: React.ReactNode;
    option: TutorialIslandOption;
    style?: any;
}

export const TutorialIslandElement = ({ children, option, style }: Props) => {
    const tutorialIslandState = GlobalStateCustomHooks.useTutorialIslandState();
    if (!tutorialIslandState) {
        return (
            <Passthrough style={style} option={option}>
                {children}
            </Passthrough>
        );
    }

    const tutorialIslandIsActive = TutorialIslandService.tutorialIsActive(tutorialIslandState);
    if (!tutorialIslandIsActive) {
        return (
            <Passthrough style={style} option={option}>
                {children}
            </Passthrough>
        );
    }

    const stepContainsOption = TutorialIslandService.stepContainsOption(
        tutorialIslandState.currentStep,
        option
    );

    if (!stepContainsOption) {
        return (
            <Blocked style={style} option={option}>
                {children}
            </Blocked>
        );
    }

    return (
        <Targeted style={style} option={option}>
            {children}
        </Targeted>
    );
};
