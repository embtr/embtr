import { Text, View } from 'react-native';
import { User } from 'resources/schema';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { getHumanReadableDate } from 'src/util/DateUtility';
import {
    PADDING_LARGE,
    PADDING_MEDIUM,
    PADDING_SMALL,
    POPPINS_MEDIUM,
    POPPINS_REGULAR,
    POPPINS_SEMI_BOLD,
} from 'src/util/constants';
import { TimelineElementType } from 'resources/types/requests/Timeline';
import { getDateFromDayKey } from 'src/controller/planning/PlannedDayController';
import { format } from 'date-fns';
import { BadgeBelt } from 'src/components/common/badge/BadgeBelt';
import { OptimalImage } from 'src/components/common/images/OptimalImage';

interface ImplProps {
    date: Date;
    displayImage: JSX.Element;
    badgeBelt: JSX.Element;
    header: string;
    subHeader: string;
    type: TimelineElementType;
    dayKey?: string;
}

const getLabel = (type: TimelineElementType, dayKey: string) => {
    switch (type) {
        case TimelineElementType.USER_POST:
            return 'Post';
        case TimelineElementType.PLANNED_DAY_RESULT:
            return format(getDateFromDayKey(dayKey ?? ''), 'MMMM dd, yyyy');
        case TimelineElementType.USER_FEATURED_POST:
            return 'Featured Post';
        default:
            return 'Challenge';
    }
};

const getLabelColor = (type: TimelineElementType, colors: any) => {
    switch (type) {
        case TimelineElementType.USER_POST:
            return colors.timeline_label_user_post;
        case TimelineElementType.USER_FEATURED_POST:
            return colors.accent_color;
        case TimelineElementType.PLANNED_DAY_RESULT:
            return colors.link;
        case TimelineElementType.RECENTLY_JOINED_CHALLENGE:
            return colors.secondary_accent_color;
    }
};

const CardHeaderImpl = ({
    date,
    dayKey,
    displayImage,
    badgeBelt,
    header,
    subHeader,
    type,
}: ImplProps) => {
    const { colors } = useTheme();

    let datePretty = getHumanReadableDate(date);

    const label = getLabel(type, dayKey ?? '');
    const color = getLabelColor(type, colors);

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center', // Align items vertically
            }}
        >
            {/* User Details */}
            {displayImage}
            <View style={{ paddingLeft: PADDING_LARGE, flexShrink: 1 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        numberOfLines={1}
                        ellipsizeMode={'clip'}
                        style={{
                            fontFamily: POPPINS_SEMI_BOLD,
                            fontSize: 16,
                            includeFontPadding: false,
                            color: colors.text,
                            flexShrink: 1,
                        }}
                    >
                        {header}
                    </Text>

                    <View style={{ paddingLeft: PADDING_SMALL }}>{badgeBelt}</View>
                </View>

                <Text
                    style={{
                        includeFontPadding: false,
                        fontFamily: POPPINS_MEDIUM,
                        fontSize: 11,
                        color: colors.secondary_text,
                        paddingBottom: PADDING_SMALL,
                        flexShrink: 1,
                    }}
                    numberOfLines={1} // Truncate subHeader if needed
                >
                    {subHeader}
                </Text>
            </View>

            {/* Spacer to push Post and date details to the right */}
            <View style={{ flex: 1 }} />

            {/* Post and date details */}
            <View style={{ alignItems: 'flex-end', paddingLeft: PADDING_MEDIUM }}>
                <Text
                    style={{
                        includeFontPadding: false,
                        fontFamily: POPPINS_REGULAR,
                        fontSize: 10,
                        color: colors.secondary_text,
                        textAlign: 'right',
                        paddingBottom: PADDING_SMALL,
                    }}
                >
                    Posted {datePretty}
                </Text>

                <View
                    style={{
                        marginBottom: PADDING_MEDIUM,
                        backgroundColor: color,
                        paddingHorizontal: 12,
                        paddingVertical: 2,
                        borderRadius: 50,
                    }}
                >
                    <Text
                        style={{
                            includeFontPadding: false,
                            fontFamily: POPPINS_SEMI_BOLD,
                            fontSize: 9,
                            color: colors.text,
                            textAlign: 'center',
                        }}
                    >
                        {label}
                    </Text>
                </View>
            </View>
        </View>
    );
};

interface Props {
    date: Date;
    user?: User;
    dayKey?: string;
    header?: string;
    subHeader?: string;
    type: TimelineElementType;
}

const UserCardHeader = ({ date, user, dayKey, header, subHeader, type }: Props) => {
    if (!user) {
        return <View />;
    }

    const displayImage = <NavigatableUserImage user={user} size={45} />;
    const badgeBelt = <BadgeBelt user={user} size={13} />;

    return (
        <CardHeaderImpl
            date={date}
            dayKey={dayKey}
            displayImage={displayImage}
            badgeBelt={badgeBelt}
            header={header ?? user.displayName ?? ''}
            subHeader={subHeader ?? user.location ?? ''}
            type={type}
        />
    );
};

const FeaturedPostCardHeader = ({ date, dayKey, type, header, subHeader }: Props) => {
    const displayImage = (
        <OptimalImage
            data={{ localImage: 'GENERAL.LOGO' }}
            style={{ height: 45, width: 45, borderRadius: 100 }}
        />
    );
    const badgeBelt = <View />;

    return (
        <CardHeaderImpl
            date={date}
            dayKey={dayKey}
            displayImage={displayImage}
            badgeBelt={badgeBelt}
            header={header ?? ''}
            subHeader={subHeader ?? ''}
            type={type}
        />
    );
};

export const CardHeader = ({ date, user, dayKey, header, subHeader, type }: Props) => {
    if (user) {
        return (
            <UserCardHeader
                date={date}
                user={user}
                dayKey={dayKey}
                header={header}
                subHeader={subHeader}
                type={type}
            />
        );
    }

    return (
        <FeaturedPostCardHeader
            date={date}
            dayKey={dayKey}
            header={header}
            subHeader={subHeader}
            type={type}
        />
    );
};
