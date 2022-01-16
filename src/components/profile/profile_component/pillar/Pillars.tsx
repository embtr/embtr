import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';
import { View, ViewStyle } from 'react-native';
import { Pillar } from 'src/components/profile/profile_component/pillar/Pillar';
import PillarController from 'src/controller/pillar/PillarController';
import { PillarModel } from 'src/model/PillarModel';

export const Pillars = () => {
    const pillarContainerViewStyle = {
        paddingBottom: 5,
    } as ViewStyle;

    const [pillars, setPillars] = React.useState<PillarModel[]>([]);

    const getPillars = () => {
        PillarController.getPillars((updatedPillars: PillarModel[]) => {
            setPillars(updatedPillars);
        });
    };

    useFocusEffect(
        React.useCallback(() => {
            getPillars();
        }, [])
    );

    let pillarViews: JSX.Element[] = [];
    pillars.forEach(pillarModel => {
        pillarViews.push(
            <View style={pillarContainerViewStyle} key={pillarModel.name}>
                <Pillar pillarModel={pillarModel} />
            </View>
        );
    });

    return (
        <View>
            {pillarViews}
        </View>
    );
};