import React from 'react';
import { Text, View } from 'react-native';
import Animated, {
    Easing,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolate,
} from 'react-native-reanimated';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PADDING_LARGE, PADDING_SMALL, POPPINS_REGULAR } from 'src/util/constants';
import { OptimalImage } from '../images/OptimalImage';

interface Props {
    amount: number;
    sign: string;
}

const time = 4500;

export const AnimatedPointsView = ({ amount, sign }: Props) => {
    const dateTimeWithMilliseconds = new Date().getTime();
    const colors = useTheme().colors;

    const animationValue = useSharedValue(0);

    React.useEffect(() => {
        animationValue.value = withTiming(1, {
            duration: time, // Adjust the duration as needed
            easing: Easing.linear,
        });
    }, [animationValue]);

    const animatedStyle = useAnimatedStyle(() => {
        const translateX = animationValue.value * (PADDING_LARGE * 10);
        const translateY = (1 - animationValue.value) * (PADDING_LARGE * 12) - PADDING_LARGE * 6;
        const opacity = interpolate(animationValue.value, [0, 0.001, 0.4], [0, 1, 0]);

        return {
            transform: [{ translateX }, { translateY }],
            opacity,
        };
    });

    return (
        <Animated.View
            style={[
                {
                    borderColor: '#404040',
                    backgroundColor: colors.accent_color_faint,
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: PADDING_LARGE,
                    position: 'absolute',
                    right: PADDING_LARGE * 4,
                    zIndex: dateTimeWithMilliseconds,
                },
                animatedStyle,
            ]}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text
                    style={{
                        fontFamily: POPPINS_REGULAR,
                        color: colors.text,
                        paddingRight: PADDING_SMALL,
                    }}
                >
                    <Text
                        style={{
                            color: sign === '-' ? colors.progress_bar_failed : colors.text,
                        }}
                    >
                        {sign} {amount}
                    </Text>
                </Text>

                <OptimalImage
                    data={{ localImage: 'GENERAL.POINTS' }}
                    style={{ height: 14, width: 14 }}
                />
            </View>
        </Animated.View>
    );
};
