import React from 'react';
import { View } from 'react-native';
import { PADDING_LARGE } from 'src/util/constants';
import { ChallengeFilters } from './ChallengeFilters';
import { FilteredUpcomingChallenges } from './FilteredUpcomingChallenges';

export const UpcomingChallenges = () => {
    return (
        <View style={{ flex: 1 }}>
            <View style={{ paddingVertical: PADDING_LARGE * 1.5 }}>
                <ChallengeFilters />
            </View>

            <FilteredUpcomingChallenges />
        </View>
    );
};
