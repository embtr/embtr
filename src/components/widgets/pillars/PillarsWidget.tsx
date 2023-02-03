import { View, Text } from 'react-native';
import { PillarPreview } from 'src/components/plan/PillarPreview';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PillarModel } from 'src/model/PillarModel';
import { POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { WidgetBase } from '../WidgetBase';
import { UserModel } from 'src/controller/user/UserController';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainTabScreens } from 'src/navigation/RootStackParamList';
import { useAppSelector } from 'src/redux/Hooks';

interface Props {
    user: UserModel;
    pillars: PillarModel[];
}

export const PillarsWidget = ({ user, pillars }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<MainTabScreens>>();

    let views: JSX.Element[] = [];
    for (let i = 0; i < pillars.length; i++) {
        const pillar = pillars[i];
        views.push(
            <View key={pillar.id + pillar.name} style={{ paddingTop: i > 0 ? 10 : 0 }}>
                <PillarPreview pillar={pillar} />
            </View>
        );
    }

    return (
        <WidgetBase>
            <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>Pillars</Text>

            {pillars.length > 0 ? (
                <View style={{ paddingTop: 10 }}>{views}</View>
            ) : user.uid === getCurrentUid() ? (
                <Text style={{ color: colors.text, paddingTop: 5 }}>
                    you have no upcoming goals -{' '}
                    <Text
                        onPress={() => {
                            navigation.navigate('PlanTab', { screen: 'CreateEditGoal', params: { id: undefined } });
                        }}
                        style={{ color: colors.tab_selected, fontFamily: 'Poppins_400Regular' }}
                    >
                        create one
                    </Text>
                </Text>
            ) : (
                <Text style={{ color: colors.text, paddingTop: 5 }}>we found no upcoming goals. maybe they're on vacation?</Text>
            )}
        </WidgetBase>
    );
};
