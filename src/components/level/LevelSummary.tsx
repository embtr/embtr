import { FlatList, Text, View } from 'react-native';
import { PADDING_LARGE, POPPINS_REGULAR } from 'src/util/constants';
import { Level } from 'resources/schema';
import { Screen } from '../common/Screen';
import { Banner } from '../common/Banner';
import { useTheme } from '../theme/ThemeProvider';
import { LevelSummaryElement } from './LevelSummaryElement';
import { LevelCustomHooks } from 'src/controller/level/LevelController';

const renderItem = ({ item, index }: { item: Level; index: number }) => {
  return <LevelSummaryElement level={item} isTop={index === 0} />;
};

interface ImplProps {
  levels: Level[];
}

const LevelSummaryImpl = ({ levels }: ImplProps) => {
  const colors = useTheme().colors;
  levels.sort((a, b) => (a.level ?? 0) - (b.level ?? 0));

  return (
    <Screen>
      <Banner leftIcon={'arrow-back'} leftRoute="BACK" name="Levels" />

      <View
        style={{
          width: '100%',
          padding: PADDING_LARGE * 2,
        }}
      >
        <Text style={{ color: colors.secondary_text, fontFamily: POPPINS_REGULAR }}>
          Rise through the levels by earning Grit! Grit is awarded as you complete your
          habits and use different areas of the app.
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
            renderItem={renderItem}
            data={levels}
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

export const LevelSummary = () => {
  const levels = LevelCustomHooks.useAllLevels();

  if (!levels.data) {
    return (
      <Screen>
        <View />
      </Screen>
    );
  }

  return <LevelSummaryImpl levels={levels.data} />;
};
