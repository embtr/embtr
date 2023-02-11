import { View, TouchableOpacity, Modal, Button, Text } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { getWindowHeight } from 'src/util/GeneralUtility';
import { POPPINS_REGULAR } from 'src/util/constants';

interface Props {
    dismiss: Function;
}

export const RegisterSuccessModal = ({ dismiss }: Props) => {
    const { colors } = useTheme();

    return (
        <View style={{ width: 300, height: getWindowHeight() / 3, backgroundColor: colors.modal_background, borderRadius: 7, justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center', width: '100%', paddingTop: 15, paddingBottom: 10, height: '100%' }}>
                <View>
                    <Text style={{ fontSize: 14, fontFamily: 'Poppins_500Medium', color: colors.text }}>Embtr Login</Text>
                </View>
                <View style={{ paddingTop: 10 }}>
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 12,
                            fontFamily: 'Poppins_400Regular',
                            paddingLeft: 10,
                            paddingRight: 10,
                            color: colors.text,
                        }}
                    >
                        Ready to chase your dreams!
                    </Text>
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 12,
                            fontFamily: 'Poppins_400Regular',
                            paddingLeft: 10,
                            paddingRight: 10,
                            color: colors.progress_bar_complete,
                        }}
                    >
                        Registration Complete!
                    </Text>
                </View>

                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={{ fontFamily: POPPINS_REGULAR, fontSize: 12 }}>please check your email for an account verification link.</Text>
                </View>
            </View>

            <HorizontalLine />
            <Button
                title="Dismiss"
                onPress={() => {
                    dismiss();
                }}
            />
        </View>
    );
};
