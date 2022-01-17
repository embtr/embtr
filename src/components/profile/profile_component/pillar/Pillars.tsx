import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { Pillar } from 'src/components/profile/profile_component/pillar/Pillar';
import { useTheme } from 'src/components/theme/ThemeProvider';
import PillarController from 'src/controller/pillar/PillarController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { PillarModel } from 'src/model/PillarModel';

interface Props {
    userProfileModel: UserProfileModel
}

export const Pillars = ({ userProfileModel }: Props) => {
    const { colors } = useTheme();

    const nameTextStyle = {
        fontSize: 18,
        color: colors.text
    } as TextStyle;

    const pillarContainerViewStyle = {
        paddingBottom: 5
    } as ViewStyle;

    const [pillars, setPillars] = React.useState<PillarModel[]>([]);

    const getPillars = () => {
        if (userProfileModel?.uid) {
            PillarController.getPillars(userProfileModel.uid, (updatedPillars: PillarModel[]) => {
                setPillars(updatedPillars);
            });
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getPillars();
        }, [])
    );

    let pillarViews: JSX.Element[] = [];
    pillarViews.push(
        <View style={pillarContainerViewStyle} key={"N/A"}>
            <HorizontalLine />
            <Text style={[nameTextStyle, { textAlign:"center", marginTop: 10, marginBottom: 10 }]}>{userProfileModel.name} has no Core Pillars 🤯</Text>
            <HorizontalLine />
        </View>
    );

    if (pillars.length) {
        pillarViews.pop();
        pillars.forEach(pillarModel => {
            pillarViews.push(
                <View style={pillarContainerViewStyle} key={pillarModel.name}>
                    <Pillar pillarModel={pillarModel} />
                </View>
            );
        });
    }

    return (
        <View>
            {pillarViews}
        </View>
    );
};