import * as React from 'react';
import { FeedbackModal } from 'src/components/feedback/FeedbackModal';
import { View } from 'react-native';
import { SettingsButtonElement } from '../generic/SettingsButtonElement';

export const SettingsFeedback = () => {
    const [isVisible, setIsVisible] = React.useState(false);

    const openFeedbackModal = () => {
        setIsVisible(true);
    };

    const dismissFeedbackModal = () => {
        setIsVisible(false);
    };

    return (
        <View>
            <FeedbackModal visible={isVisible} confirm={() => {}} dismiss={dismissFeedbackModal} />
            <SettingsButtonElement text={'Submit Feedback'} icon={'chatbubble-outline'} onPress={openFeedbackModal} />
        </View>
    );
};
