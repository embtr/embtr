import { IoniconName, POPPINS_REGULAR } from 'src/util/constants';
import { View, Text, Touchable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Props {
    icon: IoniconName;
    count: number;
    color?: string;
    onPress?: Function;
}

export const UpcomingChallengeActionable = ({ icon, count, color, onPress }: Props) => {
    const { colors } = useTheme();
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
                bottom: 5,
            }}
        >
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    left: 9,
                }}
            >
                <TouchableOpacity
                    disabled={!onPress}
                    onPress={() => {
                        if (!onPress) {
                            return;
                        }

                        onPress();
                    }}
                >
                    <Ionicons name={icon} size={30} color={color ?? colors.secondary_text} />
                </TouchableOpacity>

                <Text
                    style={{
                        top: 1,
                        fontSize: 14,
                        color: colors.secondary_text,
                        fontFamily: POPPINS_REGULAR,
                    }}
                >
                    {'  '}
                    {count}
                </Text>
            </View>
        </View>
    );
};
