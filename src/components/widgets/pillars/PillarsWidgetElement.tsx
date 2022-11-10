import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PillarModel } from 'src/model/PillarModel';
import { POPPINS_REGULAR } from 'src/util/constants';

interface Props {
    pillar: PillarModel;
}

export const PillarsWidgetElement = ({ pillar }: Props) => {
    const { colors } = useTheme();

    return (
        <View style={{ width: '100%' }}>
            <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontFamily: POPPINS_REGULAR }}>{pillar.name}</Text>
            </View>
        </View>
    );
};
