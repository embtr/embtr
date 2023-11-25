import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    targetQuantity: number;
    completedQuantity: number;
}

export const ProgressSvg = ({ targetQuantity, completedQuantity }: Props) => {
    const { colors } = useTheme();
    // Calculate the circumference of the circle
    const radius = 13;
    const progress = ((completedQuantity ?? 0) / (targetQuantity ?? 1)) * 100;
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
                stroke={colors.progress_bar_complete}
                strokeWidth={2}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
            />
        </Svg>
    );
};
