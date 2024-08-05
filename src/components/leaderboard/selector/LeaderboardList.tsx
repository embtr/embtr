import { Leaderboard, LeaderboardElement } from 'resources/types/dto/Leaderboard';
import { LeaderboardListElement } from './LeaderboardListElement';
import { FlatList } from 'react-native-gesture-handler';
import { PADDING_LARGE, PADDING_SMALL } from 'src/util/constants';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { IconCustomHooks } from 'src/controller/IconController';

const keyExtractor = (item: LeaderboardElement, index: number) => item.position.toString();

const ItemSeparatorComponent = () => {
    return <View style={{ height: PADDING_LARGE }} />;
};

interface Props {
    leaderboardData: Leaderboard;
    currentUserLeaderboardElement: LeaderboardElement;
}

export const LeaderboardList = ({ leaderboardData, currentUserLeaderboardElement }: Props) => {
    const data = [...leaderboardData.entries];
    if (currentUserLeaderboardElement.position > 10) {
        data.push(currentUserLeaderboardElement);
    }
    const goldIcon = IconCustomHooks.useIcon('SQUAREGOLD');
    const silverIcon = IconCustomHooks.useIcon('SQUARESILVER');
    const bronzeIcon = IconCustomHooks.useIcon('SQUAREBRONZE');

    const renderItem = ({ item, index }: { item: LeaderboardElement; index: number }) => {
        return (
            <View style={{ top: index === 10 ? -PADDING_LARGE : 0 }}>
                {index === 10 && (
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <HorizontalLine />
                        </View>

                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignContent: 'center',
                                paddingHorizontal: PADDING_SMALL,
                            }}
                        >
                            <Ionicons name={'ellipsis-horizontal'} size={20} color={'#A6A6A6'} />
                        </View>

                        <View style={{ flex: 1 }}>
                            <HorizontalLine />
                        </View>
                    </View>
                )}
                <LeaderboardListElement
                    element={item}
                    goldIcon={goldIcon.data ?? {}}
                    silverIcon={silverIcon.data ?? {}}
                    bronzeIcon={bronzeIcon.data ?? {}}
                />
            </View>
        );
    };

    return (
        <View style={{ flex: 1, paddingTop: PADDING_LARGE }}>
            <FlatList
                enabled={false}
                style={{ flex: 1 }}
                data={data}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                ItemSeparatorComponent={ItemSeparatorComponent}
            />
        </View>
    );
};
