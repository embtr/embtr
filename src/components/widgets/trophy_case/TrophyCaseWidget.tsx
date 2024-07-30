import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { WidgetBase } from '../WidgetBase';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PADDING_SMALL, POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { ChallengeParticipant } from 'resources/schema';
import { SvgUri } from 'react-native-svg';
import { TrophyDetailsModal } from 'src/components/trophy_case/TrophyDetailsModal';
import { ChallengeCustomHooks } from 'src/controller/challenge/ChallengeController';

const imageSize = 60;

interface Props {
    userId: number;
}

export const TrophyCaseWidget = ({ userId }: Props) => {
    const { colors } = useTheme();
    const [selectedChallenge, setSelectedChallenge] = React.useState<ChallengeParticipant>();

    const completedChallenges = ChallengeCustomHooks.useCompletedParticipation(userId);

    if (completedChallenges.data === undefined || completedChallenges.data.length === 0) {
        return <View />;
    }

    const trophyElements: JSX.Element[] = [];
    for (let i = 0; i < completedChallenges.data.length; i++) {
        const url = completedChallenges.data[i].challenge?.award?.icon?.remoteImageUrl;
        trophyElements.push(
            <View style={[{ paddingLeft: i > 0 ? PADDING_SMALL : 0 }]}>
                <Pressable
                    onPress={() => {
                        setSelectedChallenge(completedChallenges.data?.[i]);
                    }}
                >
                    <View
                        style={{
                            height: imageSize,
                            width: imageSize,
                            borderRadius: 4,
                            backgroundColor: colors.widget_element_background,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <SvgUri
                            width={imageSize * 0.75}
                            height={imageSize * 0.75}
                            uri={url ?? ''}
                        />
                    </View>
                </Pressable>
            </View>
        );
    }

    return (
        <WidgetBase>
            <TrophyDetailsModal
                challengeParticipant={selectedChallenge}
                visible={selectedChallenge !== undefined}
                onDismiss={() => {
                    setSelectedChallenge(undefined);
                }}
            />
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            color: colors.text,
                            fontFamily: POPPINS_SEMI_BOLD,
                            fontSize: 15,
                            lineHeight: 17,
                            bottom: 2,
                        }}
                    >
                        Trophy Case
                    </Text>
                </View>

                <View>
                    <Text
                        style={{
                            color: colors.accent_color_light,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 12,
                            lineHeight: 14,
                            bottom: 2,
                        }}
                    >
                        {completedChallenges.data?.length ?? 0}{' '}
                        {completedChallenges.data?.length === 1 ? 'Trophy' : 'Trophies'}
                    </Text>
                </View>
            </View>
            <View style={{ paddingTop: PADDING_SMALL }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {trophyElements}
                </ScrollView>
            </View>
        </WidgetBase>
    );
};
