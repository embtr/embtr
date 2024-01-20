import { useTheme } from 'src/components/theme/ThemeProvider';
import { View, Text, ViewStyle, ActivityIndicator } from 'react-native';
import * as React from 'react';
import { Image } from 'expo-image';
import { useNetInfo } from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';
import { POPPINS_MEDIUM, POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { getAuth } from 'firebase/auth';
import UserController from 'src/controller/user/UserController';
import { resetToDefault } from 'src/redux/user/GlobalState';
import { useAppDispatch } from 'src/redux/Hooks';
import { SignOutCustomHooks } from 'src/util/user/SignOutUtility';
import { LoadingOverlay } from 'src/components/common/loading/LoadingOverlay';

export const LoadingPage = () => {
    const { colors } = useTheme();

    const [loadIsSlow, setLoadIsSlow] = React.useState(false);
    const signOut = SignOutCustomHooks.useSignOut();

    const netInfo = useNetInfo();
    const isConnectedToNetwork = netInfo.isConnected;

    // add timer logic here to log user out if on this page for 10 seconds
    React.useEffect(() => {
        const signoutTimer = setTimeout(() => {
            signOut();
        }, 10000);

        const slowLoadTimer = setTimeout(() => {
            setLoadIsSlow(true);
        }, 5000);

        return () => {
            clearTimeout(signoutTimer);
            clearTimeout(slowLoadTimer);
        };
    }, []);

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
                {!isConnectedToNetwork ? (
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
                ) : loadIsSlow ? (
                    <View>
                        <Text
                            style={{
                                color: colors.secondary_text,
                                fontFamily: POPPINS_REGULAR,
                                textAlign: 'center',
                            }}
                        >
                            We're sensing some issues...
                        </Text>

                        <Text
                            style={{
                                color: colors.secondary_text,
                                fontFamily: POPPINS_REGULAR,
                                textAlign: 'center',
                            }}
                        >
                            Logging you out to reset your state. Sorry!
                        </Text>
                        <View style={{ height: TIMELINE_CARD_PADDING }} />
                        <ActivityIndicator color="#fff" animating size="large" />
                    </View>
                ) : (
                    <View />
                )}
            </View>
        </View>
    );
};
