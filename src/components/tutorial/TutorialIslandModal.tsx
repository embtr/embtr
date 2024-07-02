import { EmbtrModal } from 'src/components/common/modal/EmbtrModal';
import { useAppSelector } from 'src/redux/Hooks';
import { getTutorialIslandState } from 'src/redux/user/GlobalState';
import { TutorialIslandService } from 'src/service/TutorialIslandService';
import {
    INVALID_TOOLTIP_DATA,
    INVALID_TUTORIAL_ISLAND_OPTION,
    INVALID_TUTORIAL_ISLAND_STEP,
    TutorialIslandOptionKey,
} from 'src/model/tutorial_island/TutorialIslandModels';
import { TutorialIslandTooltip } from './TutorialIslandTooltip';
import { getWindowHeight, getWindowWidth } from 'src/util/GeneralUtility';
import { GlobalStateCustomHooks } from 'src/redux/user/GlobalStateCustomHooks';

interface Props { }

export const TutorialIslandModal = ({ }: Props) => {
    const reportOptionPressed = GlobalStateCustomHooks.useReportOptionPressed();

    const tutorialIslandState = useAppSelector(getTutorialIslandState);

    const currentStep =
        TutorialIslandService.getStepFromFlow(
            tutorialIslandState.flow,
            tutorialIslandState.currentStepKey
        ) ?? INVALID_TUTORIAL_ISLAND_STEP;

    const notificationOption =
        TutorialIslandService.getOptionFromStep(
            currentStep,
            TutorialIslandOptionKey.GENERAL_NOTIFICATION
        ) ?? INVALID_TUTORIAL_ISLAND_OPTION;

    const advance = () => {
        reportOptionPressed(notificationOption?.key ?? TutorialIslandOptionKey.INVALID);
    };

    const tooltip = notificationOption?.tooltip;

    const visible =
        notificationOption !== undefined &&
        notificationOption !== INVALID_TUTORIAL_ISLAND_OPTION &&
        notificationOption.tooltip !== undefined;
    notificationOption.tooltip !== INVALID_TOOLTIP_DATA;

    return (
        <EmbtrModal visible={visible} onDismiss={() => { }}>
            <TutorialIslandTooltip
                tooltip={tooltip ?? INVALID_TOOLTIP_DATA}
                onDismiss={() => {
                    advance();
                }}
                parentWidth={getWindowWidth()}
                parentHeight={getWindowHeight()}
            />
        </EmbtrModal>
    );
};
