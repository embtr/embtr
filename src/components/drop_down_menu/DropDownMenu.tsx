import { View } from 'react-native';
import { PADDING_LARGE } from 'src/util/constants';
import { DropDownMenuItem, DropDownMenuItemData } from './DropDownMenuItem';

interface Props {
    items: DropDownMenuItemData[];
}

export const DropDownMenu = ({ items }: Props) => {
    const elements = items.map((item, index) => {
        return (
            <View key={index}>
                <DropDownMenuItem item={item} />
            </View>
        );
    });

    return (
        <View
            style={{
                position: 'absolute',
                zIndex: 1,
                left: -71, // Align to the left of the parent container
                bottom: -100 - 1.5 * PADDING_LARGE, // Align to the bottom of the parent container
                borderRadius: 12,
                borderWidth: 2,
                borderColor: 'yellow',
            }}
        >
            {elements}
        </View>
    );
};
