import * as React from 'react';
import { Pillars } from 'src/components/profile/profile_component/pillar/Pillars';
import { View, Text, TextStyle, Button } from 'react-native';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { getCurrentUserUid } from 'src/session/CurrentUserProvider';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileTabScreens } from 'src/navigation/RootStackParamList';

interface Props {
    userProfileModel: UserProfileModel
}

type pillarsConfigurationProps = StackNavigationProp<ProfileTabScreens, 'PillarsConfiguration'>;

export const ProfileBody = ({ userProfileModel }: Props) => {
    const { colors } = useTheme();

    const textStyle = {
        fontSize: 18,
        color: colors.text,
    } as TextStyle;

    const navigation = useNavigation<pillarsConfigurationProps>();

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
            <Pillars />
            {isCurrentUser && <View style={{ paddingTop: 20 }}>
                <Button title='configure' onPress={() => { navigation.navigate('PillarsConfiguration') }}></Button>
            </View>}
        </View>
    )
}
