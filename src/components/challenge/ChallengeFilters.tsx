import { FlatList, View } from 'react-native';
import { ChallengeFilter } from './ChallengeFilter';
import { PADDING_LARGE } from 'src/util/constants';
import React from 'react';
import { Constants } from 'resources/types/constants/constants';
import { useAppDispatch } from 'src/redux/Hooks';
import { setChallengeFilters } from 'src/redux/user/GlobalState';

const ItemSeparatorComponent = () => {
    return <View style={{ width: PADDING_LARGE }} />;
};

export const ChallengeFilters = () => {
    const dispatch = useAppDispatch();

    const [selected, setSelected] = React.useState<Constants.ChallengeFilterOption[]>([]);
    const options = Object.values(Constants.ChallengeFilterOption).filter(
        (value) => value !== Constants.ChallengeFilterOption.INVALID
    );
    const renderChallengeFilterOption = ({ item }: { item: Constants.ChallengeFilterOption }) => {
        const onPressed = (option: Constants.ChallengeFilterOption) => {
            let newSelected: Constants.ChallengeFilterOption[] = [];
            if (selected.includes(option)) {
                newSelected = selected.filter((value) => value !== option);
            } else {
                newSelected = [...selected, option];
            }

            setSelected(newSelected);

            setTimeout(() => {
                dispatch(setChallengeFilters(newSelected));
            }, 0);
        };

        return (
            <ChallengeFilter
                option={item}
                selected={selected.includes(item)}
                onPressed={() => onPressed(item)}
            />
        );
    };

    return (
        <View style={{ paddingHorizontal: PADDING_LARGE }}>
            <FlatList
                data={options}
                renderItem={renderChallengeFilterOption}
                ItemSeparatorComponent={ItemSeparatorComponent}
                showsHorizontalScrollIndicator={false}
                horizontal
            />
        </View>
    );
};
