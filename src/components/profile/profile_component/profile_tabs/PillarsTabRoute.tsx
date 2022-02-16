import * as React from 'react';
import { Pillars } from 'src/components/profile/profile_component/pillar/Pillars';
import { View, Text, Button } from 'react-native';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileTabScreens } from 'src/navigation/RootStackParamList';

interface Props {
    userProfileModel: UserProfileModel
}

function PillarsTabRoute ({ userProfileModel }: Props) {

    const navigation = useNavigation<StackNavigationProp<ProfileTabScreens, 'PillarsConfiguration'>>();
    const isCurrentUser = getAuth().currentUser!.uid === userProfileModel.uid;

    return (
        <View>
            <Pillars userProfileModel={userProfileModel} />
            {isCurrentUser && <View style={{ paddingTop: 20 }}>
                <Button title='configure' onPress={() => { navigation.navigate('PillarsConfiguration') }}></Button>
            </View>}
        </View>)
};

export default PillarsTabRoute;