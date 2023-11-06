import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppSelector } from 'src/redux/Hooks';
import { getGlobalLoading } from 'src/redux/user/GlobalState';

export const LoadingOverlay = () => {
    const active = useAppSelector(getGlobalLoading);

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
