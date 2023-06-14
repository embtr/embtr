import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';

interface Props {
    active: boolean;
}

export const LoadingOverlay = ({ active }: Props) => {
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
            </View>
        );
    }

    return <View />;
};
