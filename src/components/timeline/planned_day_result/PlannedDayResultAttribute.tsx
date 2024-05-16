import { Text, View } from 'react-native';
import { PlannedDayResultDto } from 'resources/types/dto/PlannedDay';
import { OptimalImage, OptimalImageData } from 'src/components/common/images/OptimalImage';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, PADDING_LARGE, POPPINS_REGULAR } from 'src/util/constants';

interface Props {
    plannedDayResult: PlannedDayResultDto;
}

const imageSize = 30;

export const PlannedDayResultAttribute = ({ plannedDayResult }: Props) => {
    const colors = useTheme().colors;

    if (!plannedDayResult.attribute) {
        return <View />;
    }

    const optimalImageData: OptimalImageData = {
        remoteImageUrl: plannedDayResult.attribute.remoteImageUrl,
        localImage: plannedDayResult.attribute.localImage,
        ionicon: plannedDayResult.attribute.ionicon,
    };

    return (
        <View
            style={[
                {
                    backgroundColor: '#343434',
                    borderRadius: 5,
                    borderWidth: 0.5,
                    borderColor: '#606060',
                    paddingHorizontal: PADDING_LARGE,
                    paddingVertical: PADDING_LARGE,
                    flexDirection: 'row',
                },
                CARD_SHADOW,
            ]}
        >
            {optimalImageData.localImage ||
                optimalImageData.remoteImageUrl ||
                (optimalImageData.ionicon && (
                    <View style={{ paddingRight: PADDING_LARGE }}>
                        <View
                            style={{
                                height: imageSize,
                                width: imageSize,
                                borderRadius: 4,
                                backgroundColor: '#606060',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <OptimalImage
                                data={optimalImageData}
                                style={{
                                    height: imageSize * 0.85,
                                    width: imageSize * 0.85,
                                }}
                            />
                        </View>
                    </View>
                ))}

            <Text
                numberOfLines={2}
                style={{
                    fontFamily: POPPINS_REGULAR,
                    flex: 1,
                    fontSize: 13,
                    color: colors.text,
                    lineHeight: 15,
                    top: 1,
                }}
            >
                {plannedDayResult.attribute.body}
            </Text>
        </View>
    );
};
