import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PADDING_LARGE, POPPINS_SEMI_BOLD } from 'src/util/constants';

export interface SwipeableCardElementData {
    text: string;
    color: string;
    onAction: () => void;
}

export interface SwipeableSnapOptionData extends SwipeableCardElementData {
    snapPoint: number;
}

interface Props {
    data: SwipeableCardElementData | SwipeableSnapOptionData;
}

export const SwipeableCardElement = ({ data }: Props) => {
    const paddingMultiplier = data.text.length < 6 ? 1.5 : 1;
    return (
        <TouchableOpacity
            onPress={data.onAction}
            style={{
                height: '100%',
                backgroundColor: data.color,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
            }}
        >
            <View
                style={{
                    paddingLeft: PADDING_LARGE * paddingMultiplier,
                    paddingRight: PADDING_LARGE * paddingMultiplier,
                }}
            >
                <Text style={{ fontFamily: POPPINS_SEMI_BOLD, color: 'white' }}>{data.text}</Text>
            </View>
        </TouchableOpacity>
    );
};
