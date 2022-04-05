import React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';

interface Props {
    routineId: string
}

export const TaskDetails = ({ routineId }: Props) => {

    return (
        <Screen>
            <Banner name={"Task Details"} leftIcon={"arrow-back"} leftRoute={"BACK"} />
        </Screen>
    );
};