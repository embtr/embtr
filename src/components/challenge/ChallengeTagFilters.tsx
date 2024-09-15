import React from 'react';
import { Tag } from 'resources/schema';
import { FlatList, View } from 'react-native';
import { ChallengeFilter } from './ChallengeFilter';
import { PADDING_LARGE } from 'src/util/constants';
import { Constants } from 'resources/types/constants/constants';
import { useAppDispatch } from 'src/redux/Hooks';
import { setChallengeTagFilters, setGlobalLoading } from 'src/redux/user/GlobalState';
import { TagCustomHooks } from 'src/controller/TagController';

export const DEFAULT_CHALLENGE_FILTERS = [
    Constants.ChallengeFilterOption.UPCOMING,
    Constants.ChallengeFilterOption.ONGOING,
];

const ItemSeparatorComponent = () => {
    return <View style={{ width: PADDING_LARGE }} />;
};

interface Props {
    tags: Tag[];
}

export const ChallengeTagFiltersImpl = ({ tags }: Props) => {
    const dispatch = useAppDispatch();

    const [selected, setSelected] = React.useState<Tag[]>([]);

    const renderChallengeTagFilterOption = ({ item }: { item: Tag }) => {
        const onPressed = (option: Tag) => {
            let newSelected: Tag[] = [];
            if (selected.includes(option)) {
                newSelected = selected.filter((value) => value !== option);
            } else {
                newSelected = [...selected, option];
            }

            setSelected(newSelected);

            dispatch(setGlobalLoading(true));
            setTimeout(() => {
                dispatch(setChallengeTagFilters(newSelected));
            }, 0);
        };

        return (
            <ChallengeFilter
                option={item.name ?? ''}
                selected={selected.includes(item)}
                onPressed={() => onPressed(item)}
            />
        );
    };

    return (
        <View style={{ paddingHorizontal: PADDING_LARGE, flex: 1 }}>
            <FlatList
                data={tags}
                renderItem={renderChallengeTagFilterOption}
                ItemSeparatorComponent={ItemSeparatorComponent}
                showsHorizontalScrollIndicator={false}
                horizontal
            />
        </View>
    );
};

export const ChallengeTagFilters = () => {
    const tags = TagCustomHooks.useTagsByCategory(Constants.TagCategory.CHALLENGE);
    if (!tags.data) {
        return null;
    }

    // filter out tag Defaults
    const allTags = tags.data.filter((tag) => tag.name !== 'DEFAULT');

    return <ChallengeTagFiltersImpl tags={allTags} />;
};
