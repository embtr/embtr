import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { PillarModel } from 'src/model/PillarModel';
import PillarController from 'src/controller/pillar/PillarController';
import UserController from 'src/controller/user/UserController';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import { Pillar } from './Pillar';

export const Pillars = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const [pillars, setPillars] = React.useState<PillarModel[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            const fetchPillars = async () => {
                const user = await UserController.getCurrentUser();
                const pillars = await PillarController.getPillars(user);
                setPillars(pillars);
            };

            fetchPillars();
        }, [])
    );

    let views: JSX.Element[] = [];
    pillars.forEach((pillar) => {
        views.push(
            <View key={pillar.id} style={{ paddingBottom: 5, width: '100%', alignItems: 'center' }}>
                <Pillar pillar={pillar} />
            </View>
        );
    });

    return (
        <Screen>
            <View style={{ height: '100%' }}>
                <Banner
                    name={'Pillars'}
                    leftText={'back'}
                    leftRoute="BACK"
                    rightIcon={'add'}
                    rightOnClick={() => {
                        navigation.navigate('CreateEditPillar');
                    }}
                />
                <ScrollView style={{ backgroundColor: colors.background, paddingTop: 7 }}>{views}</ScrollView>
            </View>
        </Screen>
    );
};
