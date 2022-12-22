import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { WidgetBase } from 'src/components/widgets/WidgetBase';
import PillarController from 'src/controller/pillar/PillarController';
import UserController from 'src/controller/user/UserController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { PillarModel } from 'src/model/PillarModel';
import { ProfileTabScreens } from 'src/navigation/RootStackParamList';
import { ProfilePillar } from './ProfilePillar';

interface Props {
    userProfileModel: UserProfileModel;
}

export const ProfilePillars = ({ userProfileModel }: Props) => {
    const [pillars, setPillars] = React.useState<PillarModel[]>([]);

    const navigation = useNavigation<StackNavigationProp<ProfileTabScreens>>();

    React.useEffect(() => {
        fetchPillars();
    }, []);

    const fetchPillars = async () => {
        if (userProfileModel?.uid) {
            const user = await UserController.get(userProfileModel.uid);
            const pillars = await PillarController.getPillars(user);
            setPillars(pillars);
        }
    };

    let pillarViews: JSX.Element[] = [];
    if (pillars.length) {
        pillarViews.pop();
        pillars.forEach((pillarModel) => {
            pillarViews.push(
                <View key={pillarModel.name + pillarModel.id}>
                    <WidgetBase>
                        <TouchableOpacity
                            onPress={() => {
                                if (pillarModel.id) {
                                    navigation.navigate('PillarDetails', { uid: pillarModel.uid, id: pillarModel.id });
                                }
                            }}
                        >
                            <ProfilePillar pillarModel={pillarModel} />
                        </TouchableOpacity>
                    </WidgetBase>
                </View>
            );
        });
    }

    return <View>{pillarViews}</View>;
};
