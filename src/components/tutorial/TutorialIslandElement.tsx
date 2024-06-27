import React from 'react';
import { View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { TutorialIslandOption, TutorialIslandTooltipData } from 'src/model/TutorialIslandModels';
import { GlobalStateCustomHooks } from 'src/redux/user/GlobalStateCustomHooks';
import { TutorialIslandService } from 'src/service/TutorialIslandService';
import { TutorialIslandTooltip } from './TutorialIslandTooltip';

interface InnerProps {
    children: React.ReactNode;
    option: TutorialIslandOption;
    onPress?: () => void;
    tooltip?: TutorialIslandTooltipData;
    style?: any;
}

const Targeted = ({ children, option, onPress, tooltip, style }: InnerProps) => {
    const reportOptionPressed = GlobalStateCustomHooks.useReportOptionPressed();

    const [layout, setLayout] = React.useState({ width: 0, height: 0 });

    return (
        <View
            style={style}
            onLayout={(event) => {
                setLayout(event.nativeEvent.layout);
            }}
        >
            <TouchableWithoutFeedback
                onPress={() => {
                    reportOptionPressed(option);
                    onPress?.();
                }}
            >
                {tooltip && (
                    <TutorialIslandTooltip
                        tooltip={tooltip}
                        parentWidth={layout.width}
                        parentHeight={layout.height}
                    />
                )}
                {children}
            </TouchableWithoutFeedback>
        </View>
    );
};

const Passthrough = ({ children, option, onPress, style }: InnerProps) => {
    return (
        <View style={style}>
            <TouchableWithoutFeedback
                onPress={() => {
                    onPress?.();
                }}
            >
                {children}
            </TouchableWithoutFeedback>
        </View>
    );
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
    onPress?: () => void;
    style?: any;
}

export const TutorialIslandElement = ({ children, option, onPress, style }: Props) => {
    const tutorialIslandState = GlobalStateCustomHooks.useTutorialIslandState();
    if (!tutorialIslandState) {
        return (
            <Passthrough style={style} option={option} onPress={onPress}>
                {children}
            </Passthrough>
        );
    }

    const tutorialIslandIsActive = TutorialIslandService.tutorialIsActive(tutorialIslandState);
    if (!tutorialIslandIsActive) {
        return (
            <Passthrough style={style} option={option} onPress={onPress}>
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
        <Targeted style={style} option={option} onPress={onPress} tooltip={tooltip}>
            {children}
        </Targeted>
    );
};
