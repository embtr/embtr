import * as React from 'react';
import { View, Text, ViewStyle, TextStyle, Button } from 'react-native';
import { Pillar } from 'src/components/profile/profile_component/pillar/Pillar';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { getCurrentUserUid } from 'src/session/CurrentUserProvider';

interface Props {
    userProfileModel: UserProfileModel
}

export const Pillars = ({ userProfileModel }: Props) => {
    const { colors } = useTheme();

    const textStyle = {
        fontSize: 18,
        color: colors.text,
    } as TextStyle;

    const pillarContainerViewStyle = {
        paddingBottom: 5,
    } as ViewStyle;

    const [isCurrentUser, setIsCurrentUser] = React.useState<boolean>(false);
    React.useEffect(() => {
        getCurrentUserUid((uid: string) => {
            setIsCurrentUser(uid === userProfileModel.uid);
        });
    }, []);

    return (
        <View>
            <View style={{ alignItems: "center", paddingBottom: 25, paddingTop: 25 }}>
                <Text style={textStyle}>Pillars</Text>
            </View>

            <View style={pillarContainerViewStyle}>
                <Pillar name='Health' />
            </View>

            <View style={pillarContainerViewStyle}>
                <Pillar name='Famlily' />
            </View>

            <View style={pillarContainerViewStyle}>
                <Pillar name='Fitness' />
            </View>

            <View style={pillarContainerViewStyle}>
                <Pillar name='Programming' />
            </View>

            {isCurrentUser && <View style={{ paddingTop: 20 }}>
                <Button title='configure' onPress={() => { }}></Button>
            </View>}
        </View>
    );
};