import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PADDING_LARGE, POPPINS_SEMI_BOLD } from 'src/util/constants';

export interface SwipeableCardElementData {
    text: string;
    color: string;
    onPress: () => void;
    onOpened?: () => void;
}

export const SwipeableCardElement = ({
    text,
    color,
    onPress,
    onOpened,
}: SwipeableCardElementData) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                height: '100%',
                backgroundColor: color,
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
                <Text style={{ fontFamily: POPPINS_SEMI_BOLD, color: 'white' }}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
};
