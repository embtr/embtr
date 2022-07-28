import * as React from 'react';
import { ScrollView, Text, TextStyle, View } from 'react-native';
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

    const [pillars, setPillars] = React.useState<PillarModel[]>([]);

    React.useEffect(() => {
        if (userProfileModel?.uid) {
            PillarController.getPillars(userProfileModel.uid, (updatedPillars: PillarModel[]) => {
                setPillars(updatedPillars);
            });
        }
    }, []);

    let pillarViews: JSX.Element[] = [];
    pillarViews.push(
        <View key={"N/A"}>
            <Text style={[nameTextStyle, { textAlign: "center", marginTop: 10, marginBottom: 10 }]}>{userProfileModel.name} has no Core Pillars 🤯</Text>
        </View>
    );

    if (pillars.length) {
        pillarViews.pop();
        pillars.forEach(pillarModel => {
            pillarViews.push(
                <View key={pillarModel.name}>
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