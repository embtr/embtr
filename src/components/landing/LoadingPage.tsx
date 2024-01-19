import { useTheme } from 'src/components/theme/ThemeProvider';
import { View, Text, ViewStyle } from 'react-native';
import * as React from 'react';
import { Image } from 'expo-image';
import { useNetInfo } from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';
import { POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';

export const LoadingPage = () => {
    const { colors } = useTheme();

    const netInfo = useNetInfo();
    const isConnectedToNetwork = netInfo.isConnected;

    const loadingPageView = {
        width: '100%',
        height: '100%',
        backgroundColor: colors.background,
    } as ViewStyle;

    return (
        <View style={loadingPageView}>
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                }}
            >
                <View style={{ bottom: '10%' }}>
                    <Image
                        source={require('assets/logo.png')}
                        style={{ width: 200, height: 200 }}
                    />
                </View>
                <Image
                    source={require('assets/embtr_title.svg')}
                    style={{
                        width: 410 / 2,
                        height: 97 / 2,
                    }}
                />
            </View>

            {/* FLEX 3 BUTTONS*/}
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {!isConnectedToNetwork && (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons
                            style={{ paddingRight: 10 }}
                            name={'cloud-offline-outline'}
                            size={80}
                            color={colors.progress_bar_failed}
                        />
                        <Text
                            style={{
                                alignItems: 'center',
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 16,
                                color: colors.progress_bar_failed,
                            }}
                        >
                            There appears to be an issue connecting to the server.
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};
