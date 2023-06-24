import { IoniconName, POPPINS_REGULAR } from 'src/util/constants';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    icon: IoniconName;
    count: number;
    onPress?: Function;
}

export const UpcomingChallengeActionable = ({ icon, count, onPress }: Props) => {
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
                <Ionicons
                    name={icon}
                    size={30}
                    color={colors.secondary_text}
                    onPress={() => {
                        if (!onPress) {
                            return;
                        }

                        onPress();
                    }}
                />

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
