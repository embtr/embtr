import React from 'react';
import { Text, View } from 'react-native';
import { PADDING_LARGE } from 'src/util/constants';
import { FilteredUpcomingChallenges } from './FilteredUpcomingChallenges';
import { useTheme } from '../theme/ThemeProvider';
import { ChallengeTagFilters } from './ChallengeTagFilters';
import { ChallengeGeneralFilters } from './ChallengeGeneralFilters';

export const UpcomingChallenges = () => {
    const colors = useTheme().colors;

    const [filterLabelWidth, setFilterLabelWidth] = React.useState(0);

    return (
        <View style={{ flex: 1 }}>
            <View style={{ paddingVertical: PADDING_LARGE * 1.5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                        onLayout={(event) => {
                            setFilterLabelWidth(event.nativeEvent.layout.width);
                        }}
                        style={{ color: colors.secondary_text, paddingLeft: PADDING_LARGE }}
                    >
                        filters
                    </Text>
                    <ChallengeGeneralFilters />
                </View>
                <View style={{ height: PADDING_LARGE }} />

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                        style={{
                            width: filterLabelWidth,
                            color: colors.secondary_text,
                            paddingLeft: PADDING_LARGE,
                        }}
                    >
                        tags
                    </Text>
                    <ChallengeTagFilters />
                </View>
            </View>

            <FilteredUpcomingChallenges />
        </View>
    );
};
