import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Comment } from 'src/controller/timeline/TimelineController';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { CommentsScrollView } from './CommentsScrollView';

interface Props {
    comments: Comment[];
    onViewAll: Function;
}

const CommentsShortView = ({ comments, onViewAll }: Props) => {
    const { colors } = useTheme();

    return (
        <View>
            <View style={{ flexDirection: 'row', paddingTop: 20, width: '100%' }}>
                <Text style={{ flex: 1, fontFamily: POPPINS_SEMI_BOLD, color: colors.goal_primary_font, paddingLeft: 7 }}>Comments</Text>
                <View style={{ flex: 1 }}>
                    <Text
                        onPress={() => {
                            onViewAll();
                        }}
                        style={{ textAlign: 'right', paddingRight: 15, fontFamily: POPPINS_SEMI_BOLD, fontSize: 12, color: colors.secondary_text }}
                    >
                        View All
                    </Text>
                </View>
            </View>
            <CommentsScrollView comments={comments} limit={3} />
        </View>
    );
};

export default CommentsShortView;
