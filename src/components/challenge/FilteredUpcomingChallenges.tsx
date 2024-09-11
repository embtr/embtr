import { RefreshControl, ScrollView, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { ChallengeCustomHooks } from 'src/controller/challenge/ChallengeController';
import { UpcomingChallenge } from './UpcomingChallenge';
import { PADDING_LARGE } from 'src/util/constants';
import { useAppSelector } from 'src/redux/Hooks';
import { getChallengeFilters } from 'src/redux/user/GlobalState';
import { ChallengeSummary } from 'resources/types/dto/Challenge';

interface Props {
    challengeSummaries: ChallengeSummary[];
}
export const FilteredUpcomingChallengesImpl = ({ challengeSummaries }: Props) => {
    const colors = useTheme().colors;

    const challengeElements: JSX.Element[] = [];
    for (const challengeSummary of challengeSummaries) {
        const challengeElement = (
            // to do - improve3 this rendering
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
                    onRefresh={() => { }}
                />
            }
        >
            {challengeViews}
            <View style={{ height: PADDING_LARGE }} />
        </ScrollView>
    );
};

export const FilteredUpcomingChallenges = () => {
    const filters = useAppSelector(getChallengeFilters);
    const challengeSummaries = ChallengeCustomHooks.useFilteredChallengeSummaries(filters);

    if (!challengeSummaries.data) {
        return null;
    }

    return <FilteredUpcomingChallengesImpl challengeSummaries={challengeSummaries.data} />;
};
