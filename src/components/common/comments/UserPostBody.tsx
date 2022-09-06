import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    title: string;
    post: string;
}

export const UserPostBody = ({ title, post }: Props) => {
    const { colors } = useTheme();

    return (
        <View style={{ paddingLeft: 15, paddingTop: 10 }}>
            <View>
                <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 16, color: colors.timeline_card_body }}>{title}</Text>
            </View>
            <View style={{ paddingTop: 10 }}>
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: colors.timeline_card_header }}>{post}</Text>
            </View>
        </View>
    );
};
