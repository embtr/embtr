import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { getUTCDayOfWeek } from 'src/controller/planning/TaskController';
import { PADDING_LARGE } from 'src/util/constants';
import { Screen } from 'src/components/common/Screen';
import { Image, PlannedDayResult } from 'resources/schema';
import { EmbtrKeyboardAvoidingScrollView } from 'src/components/common/scrollview/EmbtrKeyboardAvoidingScrollView';
import { Banner } from 'src/components/common/Banner';
import { PlannedTaskResultGroups } from '../PlannedTaskResultGroups';
import { CreateEditBody } from '../../CreateEditBody';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { Interactable } from 'resources/types/interactable/Interactable';

interface Props {
    plannedDayResult: PlannedDayResult;
    onSubmit: (plannedDayResult: PlannedDayResult) => void;
}

export const CreateEditPlannedDayResultBase = ({ plannedDayResult, onSubmit }: Props) => {
    const { colors } = useTheme();
    const navigation = useEmbtrNavigation();

    if (!plannedDayResult) {
        return <View />;
    }

    const bannerTitle = plannedDayResult.id ? 'Edit Daily Results' : 'Create Daily Results';

    let dayOfWeek = '';
    if (plannedDayResult.plannedDay?.date) {
        dayOfWeek = getUTCDayOfWeek(plannedDayResult.plannedDay.date);
    }

    const onBodySubmit = async (body: string, images: Image[]) => {
        const clone = { ...plannedDayResult };
        clone.description = body;
        clone.images = images;

        onSubmit(clone);
    };

    return (
        <Screen>
            <View style={{ flex: 1 }}>
                <EmbtrKeyboardAvoidingScrollView
                    header={
                        <Banner
                            name={bannerTitle}
                            leftOnClick={() => {
                                navigation.goBack();
                            }}
                            leftIcon={'arrow-back'}
                            rightColor={colors.link}
                        />
                    }
                >
                    <View style={{ paddingHorizontal: PADDING_LARGE }}>
                        <CreateEditBody
                            interactable={Interactable.PLANNED_DAY_RESULT}
                            images={plannedDayResult.images ?? []}
                            body={plannedDayResult.description ?? ''}
                            onSubmit={onBodySubmit}
                        />
                        <View style={{ paddingTop: PADDING_LARGE }} />

                        <PlannedTaskResultGroups plannedDayResult={plannedDayResult} limit={2} />
                    </View>
                </EmbtrKeyboardAvoidingScrollView>
            </View>
        </Screen>
    );
};
