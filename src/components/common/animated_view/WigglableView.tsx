import React from 'react';
import { Animated, Easing } from 'react-native';

interface Props {
    wiggle: boolean;
    children: any;
}

export const WigglableView = ({ wiggle, children }: Props) => {
    const [animatedValue] = React.useState<Animated.Value>(new Animated.Value(0));

    function getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

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
        let newRand = getRandomInt(45, 50);
        Animated.sequence([
            // start rotation in one direction (only half the time is needed)
            Animated.timing(animatedValue, {
                toValue: newRand,
                duration: newRand,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            // rotate in other direction, to minimum value (= twice the duration of above)
            Animated.timing(animatedValue, {
                toValue: newRand * 2 * -1,
                duration: newRand * 2,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            // return to begin position
            Animated.timing(animatedValue, {
                toValue: 0.0,
                duration: newRand,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
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
                            inputRange: [-100, 100],
                            outputRange: ['-0.0075rad', '0.0075rad'],
                        }),
                    },
                ],
            }}
        >
            {children}
        </Animated.View>
    );
};
