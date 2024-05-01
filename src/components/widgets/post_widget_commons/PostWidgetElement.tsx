import { Text, View } from 'react-native';
import React from 'react';
import { POPPINS_REGULAR, PADDING_LARGE } from 'src/util/constants';
import { NestedImages } from 'src/components/common/images/NestedImages';
import { OptimalImageData } from 'src/components/common/images/OptimalImage';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { formatDistance } from 'date-fns';

interface Props {
    body: string;
    commentCount: number;
    likeCount: number;
    date: Date;
    imageData: OptimalImageData[];
    imagePadSize?: number;
}

export const PostWidgetElement = ({
    body,
    commentCount,
    likeCount,
    date,
    imageData,
    imagePadSize,
}: Props) => {
    const colors = useTheme().colors;

    const daysAgo = formatDistance(date, new Date(), { addSuffix: true });
    const comments = '' + commentCount + (commentCount === 1 ? ' comment' : ' comments');
    const likes = '' + likeCount + (likeCount === 1 ? ' like' : ' likes');

    return (
        <View
            style={{
                flexDirection: 'row',
                backgroundColor: '#404040',
                borderRadius: 5,
                padding: PADDING_LARGE / 2,
            }}
        >
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                }}
            >
                <NestedImages
                    imageData={imageData}
                    size={50}
                    padSize={imagePadSize ?? 0}
                    paddingStep={3}
                />
                <View style={{ width: PADDING_LARGE }} />
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <Text
                            numberOfLines={2}
                            style={{
                                color: colors.text,
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 11,
                            }}
                        >
                            {body}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text
                            numberOfLines={1}
                            style={{
                                color: colors.secondary_text,
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 9,
                            }}
                        >
                            {likes}
                        </Text>
                        <View style={{ width: PADDING_LARGE }} />

                        <Text
                            style={{
                                color: colors.secondary_text,
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 9,
                            }}
                        >
                            {comments}
                        </Text>
                        <View style={{ flex: 1 }} />

                        <Text
                            style={{
                                color: colors.secondary_text,
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 9,
                            }}
                        >
                            {daysAgo}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};
