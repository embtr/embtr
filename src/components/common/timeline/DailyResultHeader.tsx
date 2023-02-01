import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { View, Text } from 'react-native';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { getDatePretty } from 'src/util/DateUtility';

interface Props {
    userProfileModel: UserProfileModel;
    date: Date;
}

export const DailyResultHeader = ({ userProfileModel, date }: Props) => {
    const { colors } = useTheme();

    const datePretty = getDatePretty(date);

    return (
        <View style={{ width: '100%', flexDirection: 'row' }}>
            <View style={{ flex: 1, flexDirection: 'row', paddingTop: TIMELINE_CARD_PADDING, paddingLeft: TIMELINE_CARD_PADDING }}>
                <View>{userProfileModel && <NavigatableUserImage userProfileModel={userProfileModel} size={45} />}</View>

                <View style={{ paddingLeft: 10, flex: 1, alignSelf: 'stretch' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <Text style={{ fontFamily: 'Poppins_600SemiBold', color: colors.timeline_card_header }}>{userProfileModel.name}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: TIMELINE_CARD_PADDING }}>
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, opacity: 0.75, color: colors.timeline_card_header }}>
                                {datePretty}
                            </Text>
                        </View>
                    </View>

                    <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 10, color: colors.timeline_card_header }}>{userProfileModel?.location}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};
