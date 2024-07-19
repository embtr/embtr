import React from 'react';
import { Text, Animated, View } from 'react-native';
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

    const animationValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(animationValue, {
            toValue: 1,
            duration: time, // Adjust the duration as needed
            useNativeDriver: false,
        }).start();
    }, [animationValue]);

    const translateX = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [PADDING_LARGE * 2, PADDING_LARGE * 12],
    });

    const translateY = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [PADDING_LARGE * 6, PADDING_LARGE * -6],
    });

    const opacity = animationValue.interpolate({
        inputRange: [0, 0.001, 0.4],
        outputRange: [0, 1, 0],
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
                    opacity,
                },

                {
                    zIndex: dateTimeWithMilliseconds,
                    transform: [{ translateX }, { translateY }],
                },
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
