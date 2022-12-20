import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PillarModel } from 'src/model/PillarModel';
import PillarController from 'src/controller/pillar/PillarController';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';
import { PillarPreview } from './PillarPreview';

export const PillarPreviews = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();
    const currentUser = useAppSelector(getCurrentUser);

    const [pillars, setPillars] = React.useState<PillarModel[]>([]);
    useFocusEffect(
        React.useCallback(() => {
            const fetch = async () => {
                const pillars = await PillarController.getPillars(currentUser);
                setPillars(pillars);
            };

            fetch();
        }, [])
    );

    let pillarPreviews: JSX.Element[] = [];
    for (let i = 0; i < (pillars.length <= 3 ? pillars.length : 3); i++) {
        const pillar = pillars[i];

        pillarPreviews.push(
            <View key={pillar.id} style={{ paddingBottom: 5, width: '100%', alignItems: 'center' }}>
                <PillarPreview pillar={pillar} />
            </View>
        );
    }

    return (
        <View>
            <View style={{ flexDirection: 'row', paddingBottom: 3 }}>
                <View style={{ flex: 1, justifyContent: 'flex-end', paddingLeft: 10 }}>
                    <Text style={{ color: colors.text, fontSize: 18, fontFamily: POPPINS_SEMI_BOLD }}>Pillars</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <Text
                        style={{ textAlign: 'right', paddingRight: 10, color: colors.tab_selected, fontSize: 14, fontFamily: POPPINS_SEMI_BOLD }}
                        onPress={() => {
                            navigation.navigate('Goals');
                        }}
                    >
                        See all
                    </Text>
                </View>
            </View>
            <View style={{ paddingTop: 10, paddingBottom: 0 }}>{pillarPreviews}</View>
        </View>
    );
};
