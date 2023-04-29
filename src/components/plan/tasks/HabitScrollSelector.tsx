import { FlatList, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/*
 * https://github.com/Shopify/flash-list
 */

type ioniconNames = keyof typeof Ionicons.glyphMap;

type ItemData = {
    source: string;
    icon: ioniconNames;
    name: string;
    id: number;
};

const DATA: ItemData[] = [
    {
        source: 'ionicons',
        icon: 'water-outline',
        name: 'Hydration',
        id: 1,
    },
    {
        source: 'ionicons',
        icon: 'book-outline',
        name: 'Reading',
        id: 2,
    },
    {
        source: 'ionicons',
        icon: 'fitness-outline',
        name: 'Fitness',
        id: 3,
    },
];

const Item = ({ source, icon, name }: ItemData) => (
    <View style={{ paddingLeft: 5, paddingRight: 5, alignItems: 'center' }}>
        <Text style={{ color: 'white', fontSize: 12 }}>{name}</Text>
        <Ionicons name={icon} size={30} color="white" />
    </View>
);

export const HabitScrollSelector = () => {
    const renderItem = ({ item }: { item: ItemData }) => (
        <Item source={item.source} icon={item.icon} name={item.name} id={item.id} />
    );
    return (
        <View style={{ flex: 1 }}>
            <FlatList<ItemData>
                horizontal
                data={DATA}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};
