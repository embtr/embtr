import { View, Text, Pressable } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_REGULAR } from 'src/util/constants';
import { Ionicons } from '@expo/vector-icons';

const backgroundColor = 'white';
const circleSize = 70;
const imageSize = 27.5;

interface Props {
    imageString: string;
    isClose?: boolean;
    text?: string;
    onPress?: () => void;
}

export const QuickAddElement = ({ imageString, isClose, text, onPress }: Props) => {
    const colors = useTheme().colors;

    return (
        <View>
            <Pressable
                onPress={onPress}
                style={{
                    backgroundColor: isClose ? colors.tab_selected : backgroundColor,
                    height: circleSize,
                    width: circleSize,
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Ionicons
                    name={imageString as any}
                    size={imageSize}
                    color={isClose ? colors.text : colors.accent_color}
                />
            </Pressable>

            <View>
                <View style={{ paddingTop: 5 }} />
                <Text
                    style={{ textAlign: 'center', color: colors.text, fontFamily: POPPINS_REGULAR }}
                >
                    {text ?? ''}
                </Text>
            </View>
        </View>
    );
};
