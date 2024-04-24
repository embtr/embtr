import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import {
    PADDING_LARGE,
    PADDING_SMALL,
    POPPINS_REGULAR,
    POPPINS_SEMI_BOLD,
} from 'src/util/constants';
import { ScheduledHabit } from 'resources/schema';
import { ChallengeLabel } from '../common/comments/general/ChallengeLabel';
import { WidgetBase } from '../widgets/WidgetBase';
import { OptimalImage, OptimalImageData } from '../common/images/OptimalImage';
import { ScheduledHabitUtil } from 'src/util/ScheduledHabitUtil';
import { TimeOfDayUtility } from 'src/util/time_of_day/TimeOfDayUtility';

interface Props {
    scheduledHabit: ScheduledHabit;
}

const getDaysOfWeekText = (scheduledHabit: ScheduledHabit): string => {
    if (scheduledHabit.daysOfWeekEnabled === false) {
        return 'everyday';
    }

    const count = scheduledHabit.daysOfWeek?.length ?? 0;
    return count === 7 ? 'every day' : `${count} days a week`;
};

const getTimesOfDayText = (scheduledHabit: ScheduledHabit): string => {
    if (scheduledHabit.timesOfDayEnabled === false) {
        return '';
    }

    if (scheduledHabit.timesOfDay?.some((time) => time.id === 5)) {
        return '';
    }

    const count = scheduledHabit.timesOfDay?.length ?? 0;
    if (count === 1) {
        const timeOfDay = scheduledHabit.timesOfDay?.[0];
        const timeOfDayPretty = TimeOfDayUtility.getTimeOfDayPretty(timeOfDay);
        return 'In the ' + timeOfDayPretty.toLowerCase() + ', ';
    }

    return `${count} times a day, `;
};

export const HabitSummaryElementImproved = ({ scheduledHabit }: Props) => {
    const colors = useTheme().colors;

    const imageSize = 40;
    const icon: OptimalImageData = {
        localImage: ScheduledHabitUtil.getLocalImage(scheduledHabit),
        remoteImageUrl: ScheduledHabitUtil.getRemoteImageUrl(scheduledHabit),
    };

    let challengeLabel: JSX.Element = <View />;

    if (scheduledHabit.task?.type === 'CHALLENGE') {
        challengeLabel = (
            <View
                style={{
                    alignItems: 'center',
                    paddingLeft: PADDING_SMALL,
                }}
            >
                <ChallengeLabel />
            </View>
        );
    }

    return (
        <View style={{ width: '100%', paddingHorizontal: PADDING_LARGE }}>
            <WidgetBase>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View
                        style={{
                            height: imageSize,
                            width: imageSize,
                            borderRadius: 4,
                            backgroundColor: colors.widget_element_background,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <OptimalImage
                            data={icon}
                            style={{ height: imageSize * 0.85, width: imageSize * 0.85 }}
                        />
                    </View>
                    <View style={{ flex: 1, paddingLeft: PADDING_LARGE }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontFamily: POPPINS_SEMI_BOLD,
                                    fontSize: 18,
                                    lineHeight: 20,
                                    flex: 1,
                                }}
                                numberOfLines={1}
                            >
                                {ScheduledHabitUtil.getTitle(scheduledHabit)}
                            </Text>
                            {challengeLabel}
                        </View>

                        <Text
                            style={{
                                color: colors.secondary_text,
                                fontFamily: POPPINS_REGULAR,
                                flex: 1,
                                fontSize: 14,
                            }}
                        >
                            {getTimesOfDayText(scheduledHabit)}
                            {getDaysOfWeekText(scheduledHabit)}
                        </Text>
                    </View>
                </View>
            </WidgetBase>
        </View>
    );
};
