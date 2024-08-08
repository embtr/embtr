import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PADDING_LARGE, PADDING_SMALL, POPPINS_REGULAR } from 'src/util/constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PushNotificationCustomHooks } from 'src/controller/notification/PushNotificationController';
import { DetailedFeature } from 'resources/types/dto/Feature';

const getVotesDescription = (votes: number) => {
    if (votes === 1) {
        return '1 vote';
    }
    return `${votes} votes`;
};

interface Props {
    detailedFeature: DetailedFeature;
    selected: boolean;
    onSelected: (id: number) => void;
}

export const FeatureVoteElement = ({ detailedFeature, selected, onSelected }: Props) => {
    const { colors } = useTheme();

    const pushNotificationsEnabled = PushNotificationCustomHooks.useEnabled();

    const handlePress = () => {
        onSelected(detailedFeature.id);
    };

    return (
        <TouchableOpacity disabled={!pushNotificationsEnabled} onPress={handlePress}>
            <View>
                <View
                    style={{
                        borderColor: '#404040',
                        backgroundColor: selected ? colors.accent_color_dim : '#343434',
                        borderWidth: 1,
                        borderRadius: 5,
                        flexDirection: 'row',
                        paddingVertical: PADDING_SMALL,
                        paddingHorizontal: PADDING_SMALL,
                    }}
                >
                    <View
                        style={{
                            justifyContent: 'center',
                        }}
                    >
                        <View
                            style={{
                                height: 10,
                                width: 10,
                                bottom: 1,
                                borderRadius: 25,
                                backgroundColor: selected
                                    ? colors.accent_color_light
                                    : colors.secondary_text,
                            }}
                        />
                    </View>
                    <View
                        style={{
                            flex: 1,
                            paddingLeft: PADDING_LARGE,
                        }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <Text
                                style={{
                                    color: colors.text,
                                    includeFontPadding: false,
                                    fontSize: 16,
                                    fontFamily: POPPINS_REGULAR,
                                }}
                            >
                                {detailedFeature.name}
                            </Text>

                            <View style={{ flex: 1 }} />

                            <Text
                                style={{
                                    color: colors.text,
                                    includeFontPadding: false,
                                    fontSize: 12,
                                    fontFamily: POPPINS_REGULAR,
                                }}
                            >
                                {getVotesDescription(detailedFeature.votes)}
                            </Text>
                        </View>

                        <Text
                            style={{
                                color: colors.secondary_text,
                                paddingTop: PADDING_SMALL,
                                fontSize: 13,
                                includeFontPadding: false,
                                fontFamily: POPPINS_REGULAR,
                            }}
                        >
                            {detailedFeature.description}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};
