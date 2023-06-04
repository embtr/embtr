import * as React from 'react';
import { View, TouchableOpacity, Modal, Button, Text } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TextInput } from 'react-native-gesture-handler';

interface Props {
    visible: boolean;
    confirm: Function;
    dismiss: Function;
}

export const FeedbackModal = ({ visible, confirm, dismiss }: Props) => {
    const { colors } = useTheme();

    const [feedback, setFeedback] = React.useState<string>('');

    return (
        <View>
            <Modal visible={visible} transparent={true} animationType={'fade'}>
                <View
                    style={{
                        position: 'absolute',
                        zIndex: 1,
                        height: '100%',
                        width: '100%',
                        backgroundColor: 'rgba(000,000,000,.6)',
                    }}
                >
                    <TouchableOpacity
                        style={{ flex: 1, width: '100%' }}
                        onPress={() => {
                            dismiss();
                        }}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <TouchableOpacity
                            style={{ flex: 1, width: '100%' }}
                            onPress={() => {
                                dismiss();
                            }}
                        />
                        <View>
                            <View
                                style={{
                                    width: 300,
                                    backgroundColor: colors.modal_background,
                                    borderRadius: 12,
                                    justifyContent: 'space-around',
                                }}
                            >
                                <View
                                    style={{
                                        alignItems: 'center',
                                        width: '100%',
                                        paddingTop: 15,
                                        paddingBottom: 10,
                                    }}
                                >
                                    <View>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                fontFamily: 'Poppins_500Medium',
                                                color: colors.text,
                                            }}
                                        >
                                            Thoughts?
                                        </Text>
                                    </View>
                                    <View style={{ paddingTop: 10 }}>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                fontFamily: 'Poppins_400Regular',
                                                paddingLeft: 10,
                                                paddingRight: 10,
                                                color: colors.text,
                                            }}
                                        >
                                            Let us know! All feedback is good feedback.{' '}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            width: '100%',
                                            alignItems: 'center',
                                            paddingTop: 10,
                                            paddingBottom: 10,
                                            paddingLeft: 2,
                                            paddingRight: 2,
                                        }}
                                    >
                                        <TextInput
                                            textAlignVertical="top"
                                            style={{
                                                width: '95%',
                                                fontSize: 12,
                                                fontFamily: 'Poppins_400Regular',
                                                height: 200,
                                                borderRadius: 12,
                                                backgroundColor: colors.text_input_background,
                                                borderColor: colors.text_input_border,
                                                borderWidth: 1,
                                                color: colors.text,
                                                paddingTop: 10,
                                                paddingLeft: 10,
                                                paddingRight: 10,
                                            }}
                                            multiline={true}
                                            placeholder={'I think that embtr...'}
                                            placeholderTextColor={colors.secondary_text}
                                            onChangeText={setFeedback}
                                            value={feedback}
                                            autoCorrect={true}
                                        />
                                    </View>
                                </View>

                                <HorizontalLine />

                                <View
                                    style={{
                                        backgroundColor: colors.modal_background,
                                        borderRadius: 12,
                                        paddingTop: 2.5,
                                        paddingBottom: 2.5,
                                    }}
                                >
                                    <Button
                                        title="Submit"
                                        onPress={() => {
                                            setFeedback('');
                                            dismiss();
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={{ flex: 1, width: '100%' }}
                            onPress={() => {
                                dismiss();
                            }}
                        />
                    </View>
                    <TouchableOpacity
                        style={{ flex: 1, width: '100%' }}
                        onPress={() => {
                            dismiss();
                        }}
                    />
                </View>
            </Modal>
        </View>
    );
};
