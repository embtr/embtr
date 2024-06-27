import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { TutorialIslandOption, TutorialIslandTooltipData } from 'src/model/TutorialIslandModels';
import { GlobalStateCustomHooks } from 'src/redux/user/GlobalStateCustomHooks';
import { TutorialIslandService } from 'src/service/TutorialIslandService';
import { TutorialIslandTooltip } from './TutorialIslandTooltip';

interface InnerProps {
    children: React.ReactNode;
    option: TutorialIslandOption;
    tooltip?: TutorialIslandTooltipData;
    style?: any;
}

const Targeted = ({ children, option, tooltip, style }: InnerProps) => {
    const reportOptionPressed = GlobalStateCustomHooks.useReportOptionPressed();

    return (
        <View style={style}>
            <TouchableWithoutFeedback
                onPress={() => {
                    reportOptionPressed(option);
                }}
            >
                {tooltip && <TutorialIslandTooltip tooltip={tooltip} />}
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

    const stepOption = TutorialIslandService.getStepOption(tutorialIslandState.currentStep, option);

    if (!stepOption) {
        return (
            <Blocked style={style} option={option}>
                {children}
            </Blocked>
        );
    }

    const tooltip = stepOption.tooltip;

    return (
        <Targeted style={style} option={option} tooltip={tooltip}>
            {children}
        </Targeted>
    );
};
