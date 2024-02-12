import React from 'react';
import { Animated, View } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { PADDING_SMALL } from 'src/util/constants';
import {
    SwipeableCardElement,
    SwipeableCardElementData,
    SwipeableSnapOptionData,
} from './SwipeableCardElement';
import * as Haptics from 'expo-haptics';

interface Props {
    children: any;
    leftOptions?: SwipeableCardElementData[];
    leftSnapOption?: SwipeableSnapOptionData;

    rightOptions?: SwipeableCardElementData[];
    rightSnapOption?: SwipeableSnapOptionData;
}

const maxSwipeDistance = 100;

export const SwipeableCard = React.forwardRef<Swipeable, Props>(
    ({ children, leftOptions, rightOptions, leftSnapOption, rightSnapOption }: Props, ref: any) => {
        const renderLeftActions = (progress: Animated.AnimatedInterpolation<number>) => {
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
                                    <SwipeableCardElement data={option} />
                                </View>
                            );
                        })}

                        {leftSnapOption && (
                            <View style={{ paddingRight: PADDING_SMALL }}>
                                <SwipeableCardElement data={leftSnapOption} />
                            </View>
                        )}
                    </View>
                </Animated.View>
            );
        };

        const renderRightActions = (progress: Animated.AnimatedInterpolation<number>) => {
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
                                    <SwipeableCardElement data={option} />
                                </View>
                            );
                        })}

                        {rightSnapOption && (
                            <View style={{ paddingLeft: PADDING_SMALL }}>
                                <SwipeableCardElement data={rightSnapOption} />
                            </View>
                        )}
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
                    overshootLeft={false}
                    overshootRight={false}
                    leftThreshold={ref.current?.state.leftWidth}
                    rightThreshold={ref.current?.state.rightWidth}
                    onSwipeableWillOpen={(direction) => {
                        if (direction === 'left' && leftSnapOption) {
                            if (leftSnapOption.snapPoint) {
                                setTimeout(() => {
                                    leftSnapOption.onAction();
                                    ref.current.close();
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                }, 0);
                            }
                        } else if (direction === 'right' && rightSnapOption) {
                            if (rightSnapOption.snapPoint) {
                                setTimeout(() => {
                                    rightSnapOption.onAction();
                                    ref.current.close();
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                }, 0);
                            }
                        }
                    }}
                >
                    {children}
                </Swipeable>
            </GestureHandlerRootView>
        );
    }
);
