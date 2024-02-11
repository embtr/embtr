import { Animated, View } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { PADDING_SMALL } from 'src/util/constants';
import React from 'react';
import { SwipeableCardElement, SwipeableCardElementData } from './SwipeableCardElement';

interface Props {
    children: any;
    leftOptions?: SwipeableCardElementData[];
    rightOptions?: SwipeableCardElementData[];
}

const maxSwipeDistance = 100;

export const SwipeableCard = React.forwardRef<Swipeable, Props>(
    ({ children, leftOptions, rightOptions }: Props, ref: any) => {
        const renderLeftActions = (
            progress: Animated.AnimatedInterpolation<number>,
            dragX: Animated.AnimatedInterpolation<number>
        ) => {
            const translateX = progress.interpolate({
                inputRange: [0, 1],
                outputRange: [-maxSwipeDistance, 0],
                extrapolate: 'clamp',
            });

            return (
                <Animated.View style={[{ translateX }]}>
                    <View
                        style={{
                            height: '100%',
                            borderRadius: 5,
                            flexDirection: 'row',
                        }}
                    >
                        {leftOptions?.map((option, index) => {
                            return (
                                <View style={{ paddingRight: PADDING_SMALL }}>
                                    <SwipeableCardElement {...option} />
                                </View>
                            );
                        })}
                    </View>
                </Animated.View>
            );
        };

        const renderRightActions = (
            progress: Animated.AnimatedInterpolation<number>,
            dragX: Animated.AnimatedInterpolation<number>
        ) => {
            const translateX = progress.interpolate({
                inputRange: [0, 1],
                outputRange: [maxSwipeDistance, 0],
                extrapolate: 'clamp',
            });

            return (
                <Animated.View style={[{ translateX }]}>
                    <View
                        style={{
                            height: '100%',
                            borderRadius: 5,
                            flexDirection: 'row',
                        }}
                    >
                        {rightOptions?.map((option, index) => {
                            return (
                                <View style={{ paddingLeft: PADDING_SMALL }}>
                                    <SwipeableCardElement {...option} />
                                </View>
                            );
                        })}
                    </View>
                </Animated.View>
            );
        };

        return (
            <GestureHandlerRootView>
                <Swipeable
                    ref={ref}
                    renderRightActions={renderRightActions}
                    renderLeftActions={renderLeftActions}
                    onActivated={() => {
                        console.log('ACTIVATED');
                    }}
                    onEnded={() => {
                        console.log('END');
                    }}
                    onBegan={() => {
                        console.log('ON BEGAN');
                    }}
                    overshootFriction={8}
                    onSwipeableOpen={(direction) => {
                        if (direction === 'left') {
                            leftOptions?.forEach((option) => {
                                if (option.onOpened) {
                                    option.onOpened();
                                }
                            });
                        } else {
                            rightOptions?.forEach((option) => {
                                if (option.onOpened) {
                                    option.onOpened();
                                }
                            });
                        }
                    }}
                >
                    {children}
                </Swipeable>
            </GestureHandlerRootView>
        );
    }
);
