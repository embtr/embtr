import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { POPPINS_REGULAR } from 'src/util/constants';

export interface DropDownMenuItemData {
    title: string;
    onPress: () => void;
}

interface Props {
    item: DropDownMenuItemData;
}

export const DropDownMenuItem = ({ item }: Props) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity style={{ borderRadius: 9 }} onPress={item.onPress}>
            <View
                style={{
                    height: 25,
                    width: 100,
                    backgroundColor: colors.secondary_text,
                }}
            >
                <Text
                    style={{
                        fontFamily: POPPINS_REGULAR,
                        textAlign: 'center',
                        paddingTop: 2,
                    }}
                >
                    {item.title}
                </Text>
            </View>
        </TouchableOpacity>
    );
};
