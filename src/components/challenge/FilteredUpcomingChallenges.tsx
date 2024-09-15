import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import {
    ChallengeController,
    ChallengeCustomHooks,
} from 'src/controller/challenge/ChallengeController';
import { UpcomingChallenge } from './UpcomingChallenge';
import { PADDING_LARGE, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import {
    getChallengeFilters,
    getChallengeTagFilters,
    setGlobalLoading,
} from 'src/redux/user/GlobalState';
import { ChallengeSummary } from 'resources/types/dto/Challenge';
import { Constants } from 'resources/types/constants/constants';
import { DEFAULT_CHALLENGE_FILTERS } from './ChallengeTagFilters';

interface Props {
    challengeSummaries: ChallengeSummary[];
}
export const FilteredUpcomingChallengesImpl = ({ challengeSummaries }: Props) => {
    const colors = useTheme().colors;

    const challengeElements: JSX.Element[] = [];
    for (const challengeSummary of challengeSummaries) {
        const challengeElement = (
            <UpcomingChallenge key={challengeSummary.id} challengeSummary={challengeSummary} />
        );
        challengeElements.push(challengeElement);
    }

    const challengeViews: JSX.Element[] = [];
    for (let i = 0; i < challengeElements.length; i++) {
        challengeViews.push(
            <View style={{ flex: 1, padding: PADDING_LARGE, paddingTop: 0 }}>
                {challengeElements[i]}
            </View>
        );
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            refreshControl={
                <RefreshControl
                    colors={[colors.accent_color_light]}
                    progressBackgroundColor={'white'}
                    refreshing={false}
                    onRefresh={() => {
                        ChallengeController.invalidateAllChallengeSummaries();
                    }}
                />
            }
        >
            {challengeViews}

            {challengeSummaries.length === 0 && (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontFamily: POPPINS_MEDIUM, color: colors.text }}>
                        No Challenges Found
                    </Text>

                    <Text
                        style={{
                            fontFamily: POPPINS_REGULAR,
                            color: colors.secondary_text,
                            fontSize: 13,
                        }}
                    >
                        change filters to see more
                    </Text>
                </View>
            )}
            <View style={{ height: PADDING_LARGE }} />
        </ScrollView>
    );
};

export const FilteredUpcomingChallenges = () => {
    let filters = useAppSelector(getChallengeFilters);
    if (filters.length === 1 && filters[0] === Constants.ChallengeFilterOption.INVALID) {
        filters = [...DEFAULT_CHALLENGE_FILTERS];
    }

    const tags = useAppSelector(getChallengeTagFilters);
    const tagNames = tags.map((tag) => tag.name ?? '');

    const challengeSummaries = ChallengeCustomHooks.useFilteredChallengeSummaries(
        filters,
        tagNames
    );

    const dispatch = useAppDispatch();
    if (challengeSummaries.isFetching === false) {
        dispatch(setGlobalLoading(false));
    }

    if (!challengeSummaries.data) {
        return null;
    }

    return <FilteredUpcomingChallengesImpl challengeSummaries={challengeSummaries.data} />;
};
