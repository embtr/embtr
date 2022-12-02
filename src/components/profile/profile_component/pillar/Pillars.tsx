import * as React from 'react';
import { Text, TextStyle, View } from 'react-native';
import { Pillar } from 'src/components/profile/profile_component/pillar/Pillar';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { WidgetBase } from 'src/components/widgets/WidgetBase';
import PillarController from 'src/controller/pillar/PillarController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { PillarModel } from 'src/model/PillarModel';

interface Props {
    userProfileModel: UserProfileModel;
}

export const Pillars = ({ userProfileModel }: Props) => {
    const { colors } = useTheme();
    const [pillars, setPillars] = React.useState<PillarModel[]>([]);

    React.useEffect(() => {
        if (userProfileModel?.uid) {
            PillarController.getPillars(userProfileModel.uid, (updatedPillars: PillarModel[]) => {
                setPillars(updatedPillars);
            });
        }
    }, []);

    let pillarViews: JSX.Element[] = [];
    if (pillars.length) {
        pillarViews.pop();
        pillars.forEach((pillarModel) => {
            pillarViews.push(
                <View key={pillarModel.name + pillarModel.id}>
                    <WidgetBase>
                        <Pillar pillarModel={pillarModel} />
                    </WidgetBase>
                </View>
            );
        });
    }

    return <View>{pillarViews}</View>;
};
