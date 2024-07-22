import React from 'react';
import { Level } from 'resources/schema';
import { HabitStreakTierElement } from '../habit_streak/HabitStreakTierElement';
import { CARD_SHADOW, PADDING_LARGE } from 'src/util/constants';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

const getDescription = (level: Level) => {
  if (level.level === 1) {
    return 'The beginning of your journey.';
  }

  // comma separate
  const points = (level.minPoints ?? 1) - 1;
  const commaSeparatedMinPoints = points.toLocaleString();

  return `Requres ${commaSeparatedMinPoints} Grit to reach this level.`;
};

interface Props {
  level: Level;
  isTop: boolean;
}

export const LevelSummaryElement = ({ level, isTop }: Props) => {
  const colors = useTheme().colors;

  return (
    <View
      style={[
        {
          marginTop: isTop ? 0 : PADDING_LARGE,
          paddingVertical: PADDING_LARGE,
          paddingHorizontal: PADDING_LARGE,
          backgroundColor: colors.card_background,
          borderRadius: 9,
          width: '100%',
        },
        CARD_SHADOW,
      ]}
    >
      <HabitStreakTierElement
        titlePrefix={level.name ?? ''}
        titlePostfix={''}
        body={getDescription(level)}
        icon={{ ...level.badge?.icon }}
      />
    </View>
  );
};
