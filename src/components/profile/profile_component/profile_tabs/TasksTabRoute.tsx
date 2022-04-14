import * as React from 'react';
import { View, Text } from 'react-native';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    userProfileModel: UserProfileModel
}

export const TasksTabRoute = ({ userProfileModel }: Props) => {
    const { colors } = useTheme();

    return (
        <View>
            <Text style={{ color: colors.text, textAlign: "center", paddingTop: 50 }}>
                {userProfileModel.name} has no activity (yet!)
            </Text>
        </View>
    )
};