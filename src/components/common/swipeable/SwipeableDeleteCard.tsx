import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';

interface Props {
    children: any;
    onDelete: Function;
}

const SwipeableDeleteCard = ({ children, onDelete }: Props) => {
    const maxSwipeDistance = 100;

    const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
        const translateX = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [maxSwipeDistance, 0],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View style={[{}, { translateX }]}>
                <TouchableOpacity
                    onPress={() => {
                        onDelete();
                    }}
                    style={{ height: '100%', width: '100%', backgroundColor: 'red', alignItems: 'center', justifyContent: 'center' }}
                >
                    <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                        <Text style={{ fontFamily: POPPINS_SEMI_BOLD, color: 'white' }}>Delete</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return <Swipeable renderRightActions={renderRightActions}>{children}</Swipeable>;
};

export default SwipeableDeleteCard;
