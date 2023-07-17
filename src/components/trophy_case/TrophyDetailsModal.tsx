import { getWindowHeight } from 'src/util/GeneralUtility';
import { Modal, TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { ChallengeParticipant } from 'resources/schema';
import { ModalBase } from '../common/modal/ModalBase';
import { SvgUri } from 'react-native-svg';
import { POPPINS_MEDIUM } from 'src/util/constants';

interface Props {
    challengeParticipant?: ChallengeParticipant;
    visible: boolean;
    onDismiss: Function;
}

export const TrophyDetailsModal = ({ challengeParticipant, visible, onDismiss }: Props) => {
    const { colors } = useTheme();

    const challenge = challengeParticipant?.challenge;
    const challengeReward = challenge?.challengeRewards?.[0];

    const onHandleDismiss = () => {
        onDismiss();
    };

    return (
        <ModalBase visible={visible}>
            <Modal visible={visible} transparent={true} animationType={'fade'}>
                <TouchableOpacity
                    style={{ height: getWindowHeight() / 4, width: '100%' }}
                    onPress={() => {
                        onHandleDismiss();
                    }}
                />
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => {
                            onHandleDismiss();
                        }}
                    />

                    <View
                        style={{
                            width: 300,
                            height: getWindowHeight() / 3,
                            backgroundColor: colors.modal_background,
                            borderRadius: 7,
                            justifyContent: 'space-around',
                        }}
                    >
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontFamily: 'Poppins_500Medium',
                                        color: colors.text,
                                        paddingTop: 15,
                                    }}
                                >
                                    {challenge?.name}
                                </Text>
                            </View>

                            <View style={{ paddingTop: 25 }}>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontSize: 12,
                                        fontFamily: 'Poppins_400Regular',
                                        paddingLeft: 10,
                                        paddingRight: 10,
                                        color: colors.secondary_text,
                                    }}
                                >
                                    {challenge?.description}
                                </Text>
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <SvgUri
                                    width={100}
                                    height={100}
                                    uri={challengeReward?.imageUrl ?? ''}
                                />
                                <Text
                                    style={{
                                        fontFamily: POPPINS_MEDIUM,
                                        color: colors.text,
                                        paddingTop: 20,
                                        textAlign: 'center',
                                    }}
                                >
                                    {challengeParticipant?.challengeCompletionDate?.toDateString()}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => {
                            onHandleDismiss();
                        }}
                    />
                </View>

                <TouchableOpacity
                    style={{ flex: 1, width: '100%' }}
                    onPress={() => {
                        onHandleDismiss();
                    }}
                />
            </Modal>
        </ModalBase>
    );
};
