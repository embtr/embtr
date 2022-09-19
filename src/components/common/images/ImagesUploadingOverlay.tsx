import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    active: boolean;
    progress: string;
}

export const ImagesUploadingOverlay = ({ active, progress }: Props) => {
    const { colors } = useTheme();

    if (active) {
        return (
            <View
                style={[
                    StyleSheet.absoluteFill,
                    {
                        zIndex: 3,
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                ]}
            >
                <ActivityIndicator color="#fff" animating size="large" />
                <Text style={{ color: colors.text, paddingTop: 10 }}>{progress}</Text>
            </View>
        );
    }

    return <View />
};
