import { Text, View } from 'react-native';
import { CARD_SHADOW, PADDING_LARGE, POPPINS_REGULAR } from 'src/util/constants';
import { HabitStreakCustomHooks } from 'src/controller/habit_streak/HabitStreakController';
import { HabitStreakTier } from 'resources/schema';
import { HabitStreakTierElement } from './HabitStreakTierElement';
import { Screen } from '../common/Screen';
import { Banner } from '../common/Banner';
import { FlatList } from 'react-native-gesture-handler';
import { useTheme } from '../theme/ThemeProvider';

const getDescription = (habitStreakTier: HabitStreakTier) => {
    const minStreak = habitStreakTier.minStreak ?? 0;
    if (minStreak === 0) {
        return 'The beginning of your journey.';
    }

    return `Complete all habits ${minStreak} days in a row.`;
};

const renderItem = ({ item, index }: { item: HabitStreakTier; index: number }) => {
    return (
        <View
            style={[
                {
                    marginTop: index === 0 ? 0 : PADDING_LARGE,
                    paddingVertical: PADDING_LARGE,
                    paddingHorizontal: PADDING_LARGE,
                    backgroundColor: item.backgroundColor,
                    borderRadius: 9,
                    width: '100%',
                },
                CARD_SHADOW,
            ]}
        >
            <HabitStreakTierElement
                key={item.id}
                titlePrefix={item.name ?? ''}
                titlePostfix={''}
                body={getDescription(item)}
                icon={{ ...(item.badge?.icon ?? item.icon) }}
            />
        </View>
    );
};

interface ImplProps {
    habitStreakTiers: HabitStreakTier[];
}

const HabitStreakTierSummaryImpl = ({ habitStreakTiers }: ImplProps) => {
    const colors = useTheme().colors;
    habitStreakTiers.sort((a, b) => (a.minStreak ?? 0) - (b.minStreak ?? 0));

    return (
        <Screen>
            <Banner leftIcon={'arrow-back'} leftRoute="BACK" name="Habit Streak Tiers" />

            <View
                style={{
                    width: '100%',
                    padding: PADDING_LARGE * 2,
                }}
            >
                <Text style={{ color: colors.secondary_text, fontFamily: POPPINS_REGULAR }}>
                    Habit Streaks are earned by completing all of your habits for a certain number
                    of days in a row. The longer the streak, the higher Habit Streak Tier you earn!
                </Text>
            </View>

            <View
                style={{
                    alignItems: 'center',
                    flex: 1,
                }}
            >
                <View
                    style={{
                        width: '100%',
                        paddingHorizontal: PADDING_LARGE,
                    }}
                >
                    <FlatList
                        enabled={false}
                        renderItem={renderItem}
                        data={habitStreakTiers}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => (item.id ?? 0).toString()}
                    />
                </View>
            </View>

            <View
                style={{
                    height: PADDING_LARGE,
                }}
            />
        </Screen>
    );
};

export const HabitStreakTierSummary = () => {
    const allHabitStreakTiers = HabitStreakCustomHooks.useAllHabitStreakTiers();

    if (!allHabitStreakTiers.data) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    return <HabitStreakTierSummaryImpl habitStreakTiers={allHabitStreakTiers.data} />;
};
