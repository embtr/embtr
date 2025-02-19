import { FlatList, View } from 'react-native';
import { ChallengeFilter } from './ChallengeFilter';
import { PADDING_LARGE } from 'src/util/constants';
import React from 'react';
import { Constants } from 'resources/types/constants/constants';
import { useAppDispatch } from 'src/redux/Hooks';
import { setChallengeFilters, setGlobalLoading } from 'src/redux/user/GlobalState';

export const DEFAULT_CHALLENGE_FILTERS = [
    Constants.ChallengeFilterOption.UPCOMING,
    Constants.ChallengeFilterOption.ONGOING,
];

const ItemSeparatorComponent = () => {
    return <View style={{ width: PADDING_LARGE }} />;
};

export const ChallengeGeneralFilters = () => {
    const dispatch = useAppDispatch();

    const [selected, setSelected] = React.useState<Constants.ChallengeFilterOption[]>([
        ...DEFAULT_CHALLENGE_FILTERS,
    ]);
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

            dispatch(setGlobalLoading(true));
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
        <View style={{ flex: 1, paddingHorizontal: PADDING_LARGE }}>
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
