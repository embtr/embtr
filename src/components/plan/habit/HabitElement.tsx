import { View, Text } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';

interface Props {
    iconUrl: string;
    title: string;
    description: string;
}

export const HabitElement = ({ iconUrl, title, description }: Props) => {
    const { colors } = useTheme();

    return (
        <View style={{ backgroundColor: 'green' }}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <View style={{ paddingLeft: 12 }}>
                    <SvgUri width={30} height={30} uri={iconUrl} />
                </View>

                <View style={{ flex: 1, paddingLeft: 12, justifyContent: 'center' }}>
                    <Text style={{ color: colors.text, fontFamily: POPPINS_MEDIUM }}>{title}</Text>
                </View>

                <View style={{ flex: 2, paddingLeft: 12, justifyContent: 'center' }}>
                    <Text style={{ color: colors.text, fontSize: 10, fontFamily: POPPINS_REGULAR }}>
                        this is a sweet description - go get it!
                    </Text>
                </View>
            </View>
        </View>
    );
};
