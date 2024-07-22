import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Constants } from 'resources/types/constants/constants';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    progress: number;
    stage?: number;
    color?: string;
    status?: string;
    showPercent?: boolean;
}

export const ProgressBar = ({ progress, stage, color, status, showPercent }: Props) => {
    const { colors } = useTheme();

    let currentProgress = progress === Number.POSITIVE_INFINITY ? 100 : Math.round(progress);
    if (isNaN(currentProgress)) {
        currentProgress = 100;
    }
    if (status === Constants.CompletionState.SKIPPED) {
        currentProgress = 100;
    }

    const progressPercent = `${currentProgress}%`;

    // Create a shared value for progress
    const animatedProgress = useSharedValue(0);
    const animatedStage = useSharedValue(stage ?? 0);

    useEffect(() => {
        if (stage !== undefined && stage > animatedStage.value) {
            animatedProgress.value = 0;
        } else if (stage !== undefined && stage < animatedStage.value) {
            animatedProgress.value = 100;
        }

        animatedProgress.value = withTiming(currentProgress, { duration: 500 });
        animatedStage.value = stage ?? 0;
    }, [currentProgress, stage]);

    // Create an animated style
    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: `${animatedProgress.value}%`,
        };
    });

    return (
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 5, backgroundColor: colors.progress_bar_color, borderRadius: 10 }}>
                <Animated.View
                    style={[
                        {
                            height: 6,
                            backgroundColor: color ?? colors.secondary_accent_color,
                            borderRadius: 10,
                        },
                        animatedStyle,
                    ]}
                />
            </View>
            {showPercent && (
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontFamily: 'Poppins_500Medium',
                            fontSize: 11,
                            textAlign: 'center',
                            color: color ?? colors.secondary_accent_color,
                        }}
                    >
                        {progressPercent}
                    </Text>
                </View>
            )}
        </View>
    );
};
