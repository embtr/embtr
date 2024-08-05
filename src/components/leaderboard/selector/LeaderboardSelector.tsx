import { FlatList, TouchableOpacity, View } from 'react-native';
import { LeaderboardSelectorElement } from './LeaderboardSelectorElement';
import { PADDING_LARGE } from 'src/util/constants';
import React from 'react';
import { Constants } from 'resources/types/constants/constants';

const keyExtractor = (item: Constants.LeaderboardType, index: number) => item;

const renderItem = (
    type: Constants.LeaderboardType,
    selectedType: Constants.LeaderboardType,
    setSelectedType: (type: Constants.LeaderboardType) => void
) => {
    return (
        <View style={{ paddingRight: PADDING_LARGE }}>
            <TouchableOpacity onPress={() => setSelectedType(type)}>
                <LeaderboardSelectorElement type={type} isSelected={type === selectedType} />
            </TouchableOpacity>
        </View>
    );
};

const data: Constants.LeaderboardType[] = [
    Constants.LeaderboardType.TODAY,
    Constants.LeaderboardType.WEEK,
    Constants.LeaderboardType.MONTH,
    Constants.LeaderboardType.ALL_TIME,
];

interface Props {
    selectedType: Constants.LeaderboardType;
    setSelectedType: (type: Constants.LeaderboardType) => void;
}

export const LeaderboardSelector = ({ selectedType, setSelectedType }: Props) => {
    return (
        <View>
            <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={data}
                keyExtractor={keyExtractor}
                renderItem={({ item, index }) => renderItem(item, selectedType, setSelectedType)}
            />
        </View>
    );
};
