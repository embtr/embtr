import React from 'react';
import { View } from 'react-native';
import {
    TutorialIslandFlowKey,
    TutorialIslandOption,
    TutorialIslandOptionKey,
    TutorialIslandTooltipData,
} from 'src/model/tutorial_island/TutorialIslandModels';
import { GlobalStateCustomHooks } from 'src/redux/user/GlobalStateCustomHooks';
import { TutorialIslandService } from 'src/service/TutorialIslandService';
import { TutorialIslandTooltip } from './TutorialIslandTooltip';

// 'a 10x dev lives here - wolfrik_ - 2024-07-02'

export interface TutorialIslandElementRef {
    reportOptionPressed: () => void;
    isOption: (option: TutorialIslandOption) => boolean;
}

interface InnerProps {
    children: React.ReactNode;
    optionKey: TutorialIslandOptionKey;
    onPressReportable?: boolean;
    tooltip?: TutorialIslandTooltipData;
    nextFlowKey?: TutorialIslandFlowKey;
    style?: any;
}

const Targeted = React.forwardRef<TutorialIslandElementRef, InnerProps>(
    ({ children, optionKey, onPressReportable, tooltip, style }: InnerProps, ref) => {
        const reportOptionPressed = GlobalStateCustomHooks.useReportOptionPressed();

        const advance = () => {
            reportOptionPressed(optionKey);
        };

        const [layout, setLayout] = React.useState({ width: 0, height: 0 });

        React.useImperativeHandle(ref, () => ({
            reportOptionPressed: () => {
                advance();
            },
            isOption: (option: TutorialIslandOption) => {
                return option === option;
            },
        }));

        return (
            <View
                style={[{ position: 'relative', zIndex: 1 }, style]}
                onLayout={(event) => {
                    setLayout(event.nativeEvent.layout);
                }}
            >
                <View>{children}</View>

                {tooltip && (
                    <TutorialIslandTooltip
                        tooltip={tooltip}
                        onDismiss={() => {
                            advance();
                        }}
                        parentWidth={layout.width}
                        parentHeight={layout.height}
                    />
                )}
            </View>
        );
    }
);

const Passthrough = ({ children, style }: InnerProps) => {
    return <View style={[{ position: 'relative', zIndex: 0 }, style]}>{children}</View>;
};

const Blocked = ({ children, style }: InnerProps) => {
    return (
        <View
            style={[
                { pointerEvents: 'none', position: 'relative', zIndex: 0, opacity: 0.15 },
                style,
            ]}
        >
            {children}
        </View>
    );
};

interface Props {
    children: React.ReactNode;
    optionKey: TutorialIslandOptionKey;
    onPress?: () => void;
    style?: any;
}

// forward ref
export const TutorialIslandElement = React.forwardRef<TutorialIslandElementRef, Props>(
    ({ children, optionKey, onPress, style }: Props, ref) => {
        const targetedRef = React.useRef<TutorialIslandElementRef>(null);

        React.useImperativeHandle(ref, () => ({
            reportOptionPressed: () => {
                targetedRef.current?.reportOptionPressed();
            },
            isOption: (option: TutorialIslandOption) => {
                return targetedRef.current?.isOption(option) ?? false;
            },
        }));

        const tutorialIslandState = GlobalStateCustomHooks.useTutorialIslandState();
        if (!tutorialIslandState) {
            return (
                <Passthrough style={style} optionKey={optionKey}>
                    {children}
                </Passthrough>
            );
        }

        const tutorialIslandIsActive = TutorialIslandService.tutorialIsActive(tutorialIslandState);
        if (!tutorialIslandIsActive) {
            return (
                <Passthrough style={style} optionKey={optionKey}>
                    {children}
                </Passthrough>
            );
        }

        const step = TutorialIslandService.getStepFromFlow(
            tutorialIslandState.flow,
            tutorialIslandState.currentStepKey
        );

        if (!step) {
            return (
                <Passthrough style={style} optionKey={optionKey}>
                    {children}
                </Passthrough>
            );
        }

        const option = TutorialIslandService.getOptionFromStep(step, optionKey);
        if (!option) {
            return (
                <Blocked style={style} optionKey={optionKey}>
                    {children}
                </Blocked>
            );
        }

        const tooltip = option?.tooltip;
        const onPressReportable = option?.onPressReportable;

        return (
            <Targeted
                ref={targetedRef}
                style={style}
                optionKey={optionKey}
                tooltip={tooltip}
                onPressReportable={onPressReportable}
            >
                {children}
            </Targeted>
        );
    }
);
