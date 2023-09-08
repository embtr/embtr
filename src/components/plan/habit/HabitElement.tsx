import { View, Text } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    iconUrl: string;
    title: string;
    description: string;
}

export const HabitElement = ({ iconUrl, title, description }: Props) => {
    const { colors } = useTheme();

    return (
        <View style={{ height: 50 }}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{}}>
                    <SvgUri width={50} height={50} uri={iconUrl} />
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text }}>{title}</Text>
                    <Text style={{ color: colors.secondary_text }}>{description}</Text>
                </View>
            </View>
        </View>
    );
};
