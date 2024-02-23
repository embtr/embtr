import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    size: number;
    strokeWidth: number;
    targetQuantity: number;
    completedQuantity: number;
    isSkipped?: boolean;
    isFailed?: boolean;
}

export const ProgressSvg = ({
    size,
    strokeWidth,
    targetQuantity,
    completedQuantity,
    isSkipped,
    isFailed,
}: Props) => {
    const { colors } = useTheme();

    let progressColor = colors.progress_bar_complete;
    if (isSkipped) {
        completedQuantity = targetQuantity;
        progressColor = colors.progress_bar_skipped;
    }

    if (isFailed) {
        completedQuantity = targetQuantity;
        progressColor = colors.progress_bar_failed;
    }

    if (completedQuantity > targetQuantity) {
        completedQuantity = targetQuantity;
    }

    const radius = size / 2 - strokeWidth / 2;
    const circleRadius = size / 2;

    // Calculate the circumference of the circle
    const progress = (completedQuantity / targetQuantity) * 100;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - progress / 100);

    return (
        <Svg width={size} height={size} transform={[{ rotate: '-90deg' }]}>
            {/* Background Circle */}
            <Circle
                cx={circleRadius}
                cy={circleRadius}
                r={radius}
                stroke={colors.secondary_text}
                strokeWidth={strokeWidth}
                fill="transparent"
            />

            {/* Progress Circle */}
            <Circle
                cx={circleRadius}
                cy={circleRadius}
                r={radius}
                stroke={progressColor}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
            />
        </Svg>
    );
};
