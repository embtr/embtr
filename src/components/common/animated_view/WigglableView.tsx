import React from 'react';
import { Animated, Easing } from 'react-native';

interface Props {
    wiggle: boolean;
    children: any;
}

export const WigglableView = ({ wiggle, children }: Props) => {
    const [animatedValue, setAnimatedValue] = React.useState<Animated.Value>(new Animated.Value(0));

    React.useEffect(() => {
        if (wiggle) {
            startAnimation();
        } else {
            animatedValue.stopAnimation();
        }
    }, [wiggle]);

    const startAnimation = () => {
        if (!wiggle) {
            return;
        }
        // Animation consists of a sequence of steps
        Animated.sequence([
            // start rotation in one direction (only half the time is needed)
            Animated.timing(animatedValue, { toValue: 1.0, duration: 30, easing: Easing.linear, useNativeDriver: true }),
            // rotate in other direction, to minimum value (= twice the duration of above)
            Animated.timing(animatedValue, { toValue: -1.0, duration: 60, easing: Easing.linear, useNativeDriver: true }),
            // return to begin position
            Animated.timing(animatedValue, { toValue: 0.0, duration: 30, easing: Easing.linear, useNativeDriver: true }),
        ]).start((o) => {
            if (o.finished) {
                startAnimation();
            }
        });
    };

    return (
        <Animated.View
            style={{
                transform: [
                    {
                        rotate: animatedValue.interpolate({
                            inputRange: [-1, 1],
                            outputRange: ['-0.006rad', '0.006rad'],
                        }),
                    },
                ],
            }}
        >
            {children}
        </Animated.View>
    );
};
