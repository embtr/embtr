import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { POPPINS_SEMI_BOLD, PADDING_LARGE, PADDING_MEDIUM } from 'src/util/constants';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    children: any;
    onDelete: Function;
}

const maxSwipeDistance = 100;

const SwipeableDeleteCard = ({ children, onDelete }: Props) => {
    const colors = useTheme().colors;

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
            <Animated.View
                style={[
                    {
                        paddingLeft: PADDING_MEDIUM,
                    },
                    { translateX },
                ]}
            >
                <TouchableOpacity
                    onPress={() => {
                        onDelete();
                    }}
                    style={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: colors.progress_bar_failed,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 5,
                    }}
                >
                    <View
                        style={{
                            paddingLeft: PADDING_LARGE,
                            paddingRight: PADDING_LARGE,
                        }}
                    >
                        <Text style={{ fontFamily: POPPINS_SEMI_BOLD, color: 'white' }}>
                            Delete
                        </Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <GestureHandlerRootView>
            <Swipeable renderRightActions={renderRightActions}>{children}</Swipeable>
        </GestureHandlerRootView>
    );
};

export default SwipeableDeleteCard;
