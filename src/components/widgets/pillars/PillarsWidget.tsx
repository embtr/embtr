import { View, Text } from 'react-native';
import { ProfilePillar } from 'src/components/profile/profile_component/pillar/ProfilePillar';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PillarModel } from 'src/model/PillarModel';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { WidgetBase } from '../WidgetBase';

interface Props {
    pillars: PillarModel[];
}

export const PillarsWidget = ({ pillars }: Props) => {
    const { colors } = useTheme();

    let views: JSX.Element[] = [];
    for (let i = 0; i < pillars.length; i++) {
        const pillar = pillars[i];
        views.push(
            <View key={pillar.id + pillar.name} style={{ paddingTop: i > 0 ? 10 : 0 }}>
                <ProfilePillar pillarModel={pillar} />
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
