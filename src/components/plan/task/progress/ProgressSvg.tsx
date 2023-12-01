import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    targetQuantity: number;
    completedQuantity: number;
    isSkipped?: boolean;
}

export const ProgressSvg = ({ targetQuantity, completedQuantity, isSkipped }: Props) => {
    const { colors } = useTheme();

    let progressColor = colors.progress_bar_complete;
    if (isSkipped) {
        completedQuantity = targetQuantity;
        progressColor = colors.progress_bar_skipped;
    }

    if (completedQuantity > targetQuantity) {
        completedQuantity = targetQuantity;
    }

    // Calculate the circumference of the circle
    const radius = 13;
    const progress = (completedQuantity / targetQuantity) * 100;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - progress / 100);

    return (
        <Svg width={28} height={28} transform={[{ rotate: '-90deg' }]}>
            {/* Background Circle */}
            <Circle
                cx={14}
                cy={14}
                r={radius}
                stroke={colors.secondary_text}
                strokeWidth={2}
                fill="transparent"
            />

            {/* Progress Circle */}
            <Circle
                cx={14}
                cy={14}
                r={radius}
                stroke={progressColor}
                strokeWidth={2}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
            />
        </Svg>
    );
};
