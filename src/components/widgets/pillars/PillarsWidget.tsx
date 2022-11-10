import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PillarModel } from 'src/model/PillarModel';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { WidgetBase } from '../WidgetBase';
import { PillarsWidgetElement } from './PillarsWidgetElement';

interface Props {
    pillars: PillarModel[];
}

export const PillarsWidget = ({ pillars }: Props) => {
    const { colors } = useTheme();

    let views: JSX.Element[] = [];
    for (let i = 0; i < pillars.length; i++) {
        const pillar = pillars[i];
        views.push(
            <View style={{ paddingTop: i > 0 ? 5 : 0 }}>
                <PillarsWidgetElement pillar={pillar} />
            </View>
        );
    }

    return (
        <WidgetBase>
            <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>Pillars</Text>
            <View style={{ paddingTop: 10 }}>{views}</View>
        </WidgetBase>
    );
};
