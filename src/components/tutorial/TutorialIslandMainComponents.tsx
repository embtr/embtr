import { View } from 'react-native';
import { TutorialIslandModal } from './TutorialIslandModal';
import { TutorialIslandUpdatePlannedTaskModal } from './TutorialIslandUpdatePlannedTaskModal';

export const TutorialIslandMainComponents = () => {
    return (
        <View>
            <TutorialIslandModal />
            <TutorialIslandUpdatePlannedTaskModal />
        </View>
    );
};
